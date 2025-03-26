"use client";

import Sidebar from "@/app/components/Sidebar/Sidebar";
import { useUserContext } from "@/context/UserContext";
import React from "react";

const Sidebarprovider = () => {
  const userId = useUserContext().user._id;
  return <>{userId && <Sidebar />}</>;
};

export default Sidebarprovider;
