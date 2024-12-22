import React from "react";
import Link from "next/link";
const HomePage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white text-3xl flex-col gap-y-4">
      <Link href={"/sign-in"}>Sign-in</Link>
      <Link href={"/sign-up"}>Sign-up</Link>
    </div>
  );
};

export default HomePage;
