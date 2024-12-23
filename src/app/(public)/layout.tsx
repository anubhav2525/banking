import React from "react";
import { Toaster } from "@/components/ui/toaster";
const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="h-screen w-full flex items-center justify-center dark:bg-black bg-gray-100">
      {children}
      <Toaster />
    </main>
  );
};

export default PublicLayout;
