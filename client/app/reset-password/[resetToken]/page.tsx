import React from "react";
import ResetPage from "./resetPage";

export default async function Page({
  params,
}: {
  params: Promise<{ resetToken: string }>;
}) {
  const resolvedParams = await params;
  const { resetToken } = resolvedParams;

  return <ResetPage resetToken={resetToken} />;
}
