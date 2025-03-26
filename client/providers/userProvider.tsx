"use client";
import React from "react";
import { UserContextProvider } from "../context/UserContext";
import { TasksProvider } from "../context/TaskContext";

interface Props {
  children: React.ReactNode;
}

function UserProvider({ children }: Props) {
  return (
    <UserContextProvider>
      <TasksProvider>{children}</TasksProvider>
    </UserContextProvider>
  );
}

export default UserProvider;
