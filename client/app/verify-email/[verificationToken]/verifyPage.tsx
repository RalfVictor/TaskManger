"use client";

import { useUserContext } from "@/context/UserContext";

export default function VerifyPage({
  verificationToken,
}: {
  verificationToken: string;
}) {
  const { verifyUser } = useUserContext();
  return (
    <div className="auth-page flex flex-col justify-center items-center">
      <div className="bg-white flex flex-col justify-center px-[3rem] py-[4rem] gap-[1rem] rounded-lg">
        <h1 className="text-[#999] text-[2rem] self-center">
          Verify Your Account
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md self-center"
          onClick={() => verifyUser(verificationToken)}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
