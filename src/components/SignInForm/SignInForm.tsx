"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";

const FormSchema = z.object({
  email: z.string().email().min(5).max(60),
  password: z.string().min(8).max(40),
  credential: z.string().optional().default("credentials"),
});

const SignInForm = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { reset } = useForm();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      credential: "credentials",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Handle form submission
    try {
      const response = await axios.post("/api/auth/signin", data);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default",
        });
        reset();
        // set cookie on browser
        router.replace("/dashboard");
      } else if (response.status === 400) {
        toast({
          title: "Error",
          description: response.data.error,
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else if (response.status === 500) {
        toast({
          title: "Error",
          description: response.data.error,
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data.error,
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to login",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 p-2", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <div className="w-full flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="w-full dark:bg-gray-200"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <div>
                  <Image
                    src={"/icons/google.svg"}
                    height={20}
                    width={20}
                    alt="google"
                  />
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full dark:bg-gray-200"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <div>
                  <Image
                    src={"/icons/github.svg"}
                    height={20}
                    width={20}
                    alt="github"
                  />
                </div>
              </div>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.deo@abc.xyz"
                        {...field}
                        className="input-field"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <FormLabel>
                          <div>Password</div>
                        </FormLabel>
                      </div>
                      <div>
                        <Link href={"/forget-password"} className="text-sm">
                          Forget Password?
                        </Link>
                      </div>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="**********"
                        {...field}
                        className="input-field"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link
            href="/sign-up"
            className="text-sm text-blue-500 w-full text-center"
          >
            Create an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInForm;
