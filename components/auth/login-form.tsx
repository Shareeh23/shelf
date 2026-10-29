"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginSchema, type LoginValues } from "@/lib/schema/auth";
import { authClient } from "@/lib/auth/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "google" | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onsubmit: SubmitHandler<LoginValues> = async (data) => {
    setIsAuthenticating(true);
    setAuthMethod("email");

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(error?.message);
        // TODO: implement flash message later
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      // TODO: implement flash message later
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  const socialSignInHandler = async () => {
    setIsAuthenticating(true);
    setAuthMethod("google");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        console.error(error?.message);
        // TODO: implement flash message later
        return;
      }
    } catch (err) {
      console.error(err);
      // TODO: implement flash message later
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onsubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                  aria-invalid={!!errors?.email}
                />
                {errors?.email && (
                  <FieldDescription className="text-destructive font-medium">
                    {errors?.email?.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                  aria-invalid={!!errors?.password}
                />
                {errors?.password && (
                  <FieldDescription className="text-destructive font-medium">
                    {errors?.password?.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isAuthenticating}>
                  {authMethod === "email" ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isAuthenticating}
                  onClick={socialSignInHandler}
                >
                  {authMethod === "google"
                    ? "Logging in..."
                    : "Login with Google"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?
                  <Link
                    href="/signup"
                    aria-disabled={isAuthenticating}
                    tabIndex={isAuthenticating ? -1 : 0}
                    onClick={(event) => {
                      if (isAuthenticating) event.preventDefault();
                    }}
                    className={
                      isAuthenticating ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
