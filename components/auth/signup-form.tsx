"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signupSchema, type SignupValues } from "@/lib/schema/auth";
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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "google" | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onsubmit: SubmitHandler<SignupValues> = async (data) => {
    setIsAuthenticating(true);
    setAuthMethod("email");

    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(error?.message);
        // TODO: implement flash message later
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      // TODO: implement flash message later
    } finally {
      setIsAuthenticating(false);
      setAuthMethod(null);
    }
  };

  const socialSignUpHandler = async () => {
    setIsAuthenticating(true);
    setAuthMethod("google");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        console.error(error);
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
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onsubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                aria-invalid={!!errors?.name}
                {...register("name")}
              />
              {errors?.name && (
                <FieldDescription className="text-destructive font-medium">
                  {errors?.name?.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                aria-invalid={!!errors?.email}
                {...register("email")}
              />
              {errors?.email ? (
                <FieldDescription className="text-destructive font-medium">
                  {errors?.email?.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                aria-invalid={!!errors?.password}
                {...register("password")}
              />
              {errors?.password ? (
                <FieldDescription className="text-destructive font-medium">
                  {errors?.password?.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                aria-invalid={!!errors?.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword ? (
                <FieldDescription className="text-destructive font-medium">
                  {errors?.confirmPassword?.message}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isAuthenticating}>
                  {authMethod === "email"
                    ? "Creating account..."
                    : "Create account"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isAuthenticating}
                  onClick={socialSignUpHandler}
                >
                  {authMethod === "google"
                    ? "Signing up..."
                    : "Sign up with Google"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    aria-disabled={isAuthenticating}
                    tabIndex={isAuthenticating ? -1 : 0}
                    onClick={(event) => {
                      if (isAuthenticating) event.preventDefault();
                    }}
                    className={
                      isAuthenticating ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
