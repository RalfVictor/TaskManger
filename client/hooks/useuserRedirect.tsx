"use client";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const useRedirect = (redirect: string) => {
  const router = useRouter();
  const {user} = useUserContext();
      useEffect(() => {
        if (!user || !user.email) {
          router.push(redirect);
        }
  }, [user,redirect,router]);
};

export default useRedirect;
