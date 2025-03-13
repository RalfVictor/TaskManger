"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hooks/useuserRedirect";
import { useState } from "react";
import ChangePasswordForm from "./components/auth/changepasswordform/ChangePasswordForm";

export default function Home() {
  useRedirect("/login");
  return <main></main>;
}
