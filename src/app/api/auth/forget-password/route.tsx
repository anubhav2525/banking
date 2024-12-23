"use server";
import { NextRequest } from "next/server";
import { forgetUser } from "@/actions/users.action";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { email } = data;
  return await forgetUser({ email });
}
