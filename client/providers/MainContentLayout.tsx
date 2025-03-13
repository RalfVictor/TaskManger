"use client";
import { useUserContext } from "@/context/UserContext";
import React from "react";

interface MainContentLayoutProps {
  children: React.ReactNode;
}

const MainContentLayout = ({ children }: MainContentLayoutProps) => {
  const userId = useUserContext().user._id;
  return (
    <main className={`${userId ? "pr-[20rem]" : ""}pb-[1.5rem] h-full flex`}>
      {children}
    </main>
  );
};

export default MainContentLayout;
