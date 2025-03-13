import React from "react";
import VerifyPage from "./verifyPage";


export default async function Page({ params }: { params: Promise<{ verificationToken: string }> }) {
  const { verificationToken} = await params;

  return <VerifyPage verificationToken={verificationToken} />;
}
