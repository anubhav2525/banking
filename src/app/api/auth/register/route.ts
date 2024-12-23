import { NextRequest, NextResponse } from "next/server";
import { addNewUser } from "@/actions/users.action";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, provider } = body;

    console.log("Registering user:", body);
    // For credentials, ensure password is provided
    if (provider === "credentials" && !password) {
      return NextResponse.json(
        { error: "Password is required for credentials registration" },
        { status: 400 }
      );
    }

    const userData = {
      email: email,
      provider: provider,
      password: password,
      verifyCode: String(Math.floor(100000 + Math.random() * 900000)),
    };

    // Hash password for credentials registration
    if (provider === "credentials") {
      const result = await addNewUser(userData);
      console.log("result", result);
      if (result.success) {
        return NextResponse.json(
          { message: "User registered successfully" },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { error: result.message || "Registration failed" },
          { status: 400 }
        );
      }
    }

    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
