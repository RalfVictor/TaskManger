"use client";
import { useUserContext } from "@/context/UserContext";
import { github, moon , profile } from "@/utils/Icons";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { user } = useUserContext();
  const { name } = user;
  const userId = user._id;

  return (
    <header className="flex px-6 my-4 w-full items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">
            👋
          </span>
          {userId ? `Welcome,${name}` : "Welcome to Taskfyer"}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have <span className="font-bold text-[#3aafae]">5</span>
              &nbsp;active Task
            </>
          ) : (
            "Please Login or register to View yur Tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex items-center gap-[10.4rem]">
        <button
          className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px]
          hover:bg-[#00A1F1] hover:text-white transition-all duration-200 ease-in-out"
        >
          Create a new Task
        </button>

        <div className="flex gap-4 item-center">
          <Link
            href={"https://github.com/RalfVictor/TaskManger"}
            target="blank"
            rel="noopener noreferer"
            className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {github}
          </Link>
          <Link
            href={"https://github.com/RalfVictor/TaskManger"}
            target="blank"
            rel="noopener noreferer"
            className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {moon}
          </Link>
          <Link
            href={"https://github.com/RalfVictor/TaskManger"}
            target="blank"
            rel="noopener noreferer"
            className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]"
          >
            {profile}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
