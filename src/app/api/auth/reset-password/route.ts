"use server";
import { NextRequest, } from "next/server";
import { resetPasswordUser } from "@/actions/users.action";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const {
    email,
    newPassword,
    verifyCode,
  }: {
    email: string;
    newPassword: string;
    verifyCode: string;
  } = data;
  return await resetPasswordUser({
    email,
    verifyCode,
    newPassword,
  });
}
