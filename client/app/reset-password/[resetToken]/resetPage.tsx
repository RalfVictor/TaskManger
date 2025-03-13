"use client";

import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPage({ resetToken }: { resetToken: string }) {
  const { resetPassword } = useUserContext();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };
  const togglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(resetToken)
    if (password !== confirmPassword) {
      toast.error("Passwords Do not Match");
    }
    resetPassword(resetToken, confirmPassword);
  };
  return (
    <main className="auth-page flex flex-col justify-center items-center">
      <form className="m-[2rem] px-10  py-14 rounded-xl bg-white w-full max-w-[520px]">
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Reset Your Password
          </h1>
          <div className="mt-[1rem] flex flex-col">
            <label htmlFor="pass" className="mb-1 text-[#999]">
              New Password
            </label>
            <input
              type={showPassword1 ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mb-4 px-4 py-3 rounded-lg border-[2px] outline-[#2ECC71] border-[#E5E5E5] "
              placeholder="*******"
            />
            <button
              type="button"
              className="absolute p-1 right-3 top-[26%] text-[20px] opacity-[0.45]"
            >
              {showPassword1 ? (
                <i className="fas fa-eye-slash" onClick={togglePassword1}></i>
              ) : (
                <i className="fas fa-eye" onClick={togglePassword1}></i>
              )}
            </button>
          </div>
          <div className="mt-[1rem] flex flex-col">
            <label htmlFor="pass" className="mb-1 text-[#999]">
              Confirm New Password
            </label>
            <input
              type={showPassword2 ? "text" : "password"}
              id="confirmpassword"
              name="confirmpassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="mb-4 px-4 py-3 rounded-lg border-[2px] outline-[#2ECC71] border-[#E5E5E5] "
              placeholder="*******"
            />
            <button
              type="button"
              className="absolute p-1 right-3 top-[60%] text-[20px] opacity-[0.45]"
            >
              {showPassword2 ? (
                <i className="fas fa-eye-slash" onClick={togglePassword2}></i>
              ) : (
                <i className="fas fa-eye" onClick={togglePassword2}></i>
              )}
            </button>
          </div>
          <div className="flex">
            <button
              type="submit"
              onClick={handleSubmit}
              className="cursor-pointer bg-[#08070f] p-3 mt-5 w-full rounded-lg text-[#fff] hover:bg-[#545254]  transform duration-300"
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
