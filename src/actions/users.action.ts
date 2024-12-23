"use server";
import UsersModel from "@/models/users.models";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { generateOtp, hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

interface LoginUserParams {
  email: string;
  password: string;
}

export interface AddNewUserParams {
  email: string;
  password?: string;
  provider?: string;
  verifyCode?: string;
}

export const addNewUser = async (data: AddNewUserParams) => {
  try {
    await dbConnect();
    const { email, password, provider } = data;

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      // If the user exists and is trying to sign up with a different provider, we can update the provider
      if (provider && existingUser.provider !== provider) {
        existingUser.provider = provider;
        await existingUser.save();
        return { success: true, message: "User provider updated" };
      }
      return {
        success: false,
        message: "User already exists",
        data: existingUser,
      };
    }

    let userData: Partial<AddNewUserParams> = { email, provider };

    if (provider === "credentials") {
      if (!password) {
        throw new Error("Password is required for credentials signup");
      }
      const verifyCode = generateOtp(6);
      const hashedPassword = await bcrypt.hash(password, 10);

      userData = {
        ...userData,
        password: hashedPassword,
        verifyCode: verifyCode,
      };
    }
    console.log("userData", userData);

    const newUser = new UsersModel(userData);
    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);
    // TODO: send verification email if using credentials
    // if (provider === "credentials") {
    //   await sendVerificationEmail(email, verifyCode);
    // }

    return {
      success: true,
      message: "User created successfully",
      data: savedUser,
    };
  } catch (error) {
    console.error("Error creating new user:", error);
    return {
      success: false,
      message: "Failed to add new user",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const verifyUser = async (data: {
  email: string;
  verifyCode: string;
}) => {
  try {
    await dbConnect();
    const { email, verifyCode } = data;
    const user = await UsersModel.findOne({ email }); // exiting user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    const isVerifyCodeValid = () =>
      user.verifyCode === verifyCode ? true : false;
    if (!isVerifyCodeValid)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
          data: null,
        },
        {
          status: 400,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: "User verified successfully",
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        data: null,
      },
      {
        status: 500,
      }
    );
  }
};

export const resendVerifyCode = async (data: { email: string }) => {
  try {
    await dbConnect();
    const { email } = data;
    const user = await UsersModel.findOne({ email }); // exiting user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    const newVerifyCode = await generateOtp(6);
    user.verifyCode = newVerifyCode;
    await user.save();
    // TODO: resend email with new verification code
    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent successfully, check your email",
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        data: null,
      },
      {
        status: 500,
      }
    );
  }
};

export const forgetUser = async (data: { email: string }) => {
  try {
    await dbConnect();
    const { email } = data;
    const user = await UsersModel.findOne({ email }); // exiting user
    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );

    const newVerifyCode = generateOtp(6);
    user.verifyCode = newVerifyCode;
    await user.save();
    // TODO: send email with new verification code
    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent successfully, check your email",
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        data: null,
      },
      {
        status: 500,
      }
    );
  }
};

export const resetPasswordUser = async (data: {
  email: string;
  verifyCode: string;
  newPassword: string;
}) => {
  try {
    await dbConnect();
    const { email, verifyCode, newPassword } = data;
    const user = await UsersModel.findOne({ email }); // exiting user
    if (!user)
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );

    if (user.verifyCode !== verifyCode)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
          data: null,
        },
        {
          status: 400,
        }
      );
    user.password = await hashPassword(newPassword);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        data: null,
      },
      {
        status: 500,
      }
    );
  }
};

export const loginUser = async ({ email, password }: LoginUserParams) => {
  try {
    await dbConnect();
    const user = await UsersModel.findOne({ email });
    if (!user || !user.password) {
      return { success: false, message: "Invalid credentials", data: null };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials", data: null };
    }
    return { success: true, data: user, message: "Login successful" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Failed to login" };
  }
};
