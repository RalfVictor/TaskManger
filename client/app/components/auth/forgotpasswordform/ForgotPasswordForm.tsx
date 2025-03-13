"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";

const ForgotPasswordForm = () => {
  const { forgotPasswordEmail } = useUserContext();
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    forgotPasswordEmail(email);
    setEmail("");
  };
  return (
    <form className="m-[2rem] px-10  py-14 rounded-xl bg-white w-full max-w-[520px]">
      <div className="relative z-10 flex flex-col ">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Enter Email to Change Password
        </h1>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            name="email"
            placeholder="johndoe@gmail.com"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC72]"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-10 p-3 bg-black hover:bg-slate-300 hover:text-black transform duration-300  text-white rounded-md"
        >
          Send Email
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
