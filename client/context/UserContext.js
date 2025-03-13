"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = createContext();
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState({});
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password(min 6 characters)");
      return;
    }
    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
      console.log("User registered successfully", res.data);
      toast.success("User registered successfully");
      console.log(res.data);
      setUserState({
        name: "",
        email: "",
        password: "",
      });
      router.push("/login");
    } catch (error) {
      console.log("Error registering User.", error);
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        { withCredentials: true }
      );
      toast.success("User Logged in Successfully");
      setUserState({
        email: "",
        password: "",
      });
      router.push("/");
    } catch (error) {
      console.log("Error logging into User", error);
      toast.error(error.response.data.message);
    }
  };

  const userLoginStatus = async () => {
    let loggedIn = false;

    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true,
      });
      //string to boolean
      loggedIn = !!res.data;
      setLoading(false);
      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error in getting Login Status", error);
      setLoading(false);
    }
    console.log(loggedIn);
    return loggedIn;
  };

  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });
      setLoading(false);
      toast.success("User Logged out Successfully");
      router.push("/login");
    } catch (error) {
      console.log("Error logging out", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`, {
        withCredentials: true,
      });
      setUser((prevState) => {
        return { ...prevState, ...res.data };
      });
      console.log(res);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user Details", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateUser = async (e, data) => {
    e.preventDefault();
    console.log(data);
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });
      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });
      toast.success("User updated Succesfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const emailVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verify-email`,
        {},
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      toast.success("Email Verification sent Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  //verify

  const verifyUser = async (token) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Email Verified");
      getUser();
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error");
    }
  };

  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Forgot Password Email Sent Succesfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    console.log(token);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
        },
        { withCredentials: true }
      );
      toast.success("Password Reset Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("Password changed successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error changing password", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/admin/users`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting all users", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {},
        {
          withCredentials: true, // send cookies to the server
        }
      );

      toast.success("User deleted successfully");
      setLoading(false);
      // refresh the users list
      getAllUsers();
    } catch (error) {
      console.log("Error deleting user", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();
      console.log("Logged In", isLoggedIn);
      if (isLoggedIn) {
        getUser();
      }
    };
    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        userState,
        handleUserInput,
        logoutUser,
        userLoginStatus,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
