import SignInForm from "@/components/SignInForm/SignInForm";
import React from "react";

const SignInPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div>
        <div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
