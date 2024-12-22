import SignUpForm from "@/components/SignUpForm/SignUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div>
        <div>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
