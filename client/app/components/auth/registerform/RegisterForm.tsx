"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";

const RegisterForm = () => {
  const { registerUser, userState, handleUserInput } = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  return (
    <form className="m-[2rem] px-10  py-14 rounded-xl bg-white w-full max-w-[520px]">
      <div className="relative z-10 ">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an Account. Already have an Account?
          <a
            href="/login"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            {" "}
            Login Here
          </a>
        </p>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-[#999]">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => handleUserInput("name")(e)}
            className="mb-4 px-4 py-3 rounded-lg border-[2px] outline-[#2ECC71] border-[#E5E5E5] "
            placeholder="John Doe"
          />
        </div>
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
            type={showPassword?"text":"password"}
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
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!name || !email || !password}
            onClick={registerUser}
            className="cursor-pointer bg-[#08070f] p-3 mt-5 w-full rounded-lg text-[#fff] hover:bg-[#545254]  transform duration-300"
          >
            Register Now
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
