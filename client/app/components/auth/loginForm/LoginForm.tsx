"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";

const LoginForm = () => {
  const { loginUser, userState, handleUserInput } = useUserContext();
  const { email, password } = userState;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  return (
    <form className="m-[2rem] px-10  py-14 rounded-xl bg-white w-full max-w-[520px]">
      <div className="relative z-10 ">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Login To Your Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Login now. Do you have an Account?
          <a
            href="/register"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            {" "}
            Sign up
          </a>
        </p>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => handleUserInput("email")(e)}
            className="mb-4 px-4 py-3 rounded-lg border-[2px] outline-[#2ECC71] border-[#E5E5E5] "
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => handleUserInput("password")(e)}
            className="mb-4 px-4 py-3 rounded-lg border-[2px] outline-[#2ECC71] border-[#E5E5E5] "
            placeholder="*******"
          />
          <button
            type="button"
            className="absolute p-1 right-3 top-[35%] text-[20px] opacity-[0.45]"
          >
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>
        <div className="flex justify-end mt-0">
          <p className="text-[15px] font-bold text-[#999] hover:text-[#7263F3] transition-all duration-300">
            <a href="/forgot-password">Forgot Password</a>
          </p>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!email || !password}
            onClick={loginUser}
            className="cursor-pointer bg-[#08070f] p-3 mt-5 w-full rounded-lg text-[#fff] hover:bg-[#545254]  transform duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
