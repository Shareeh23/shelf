"use client";

import { useState } from "react";
import Link from "next/link";

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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Unable to process your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isSubmitted ? "Check your email" : "Forgot your password?"}
        </CardTitle>

        <CardDescription>
          {isSubmitted
            ? "If an account exists with that email address, you'll receive a password reset link shortly."
            : "Enter the email address associated with your account. We'll send you a link to reset your password."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <FieldGroup>
            <Button nativeButton={false} render={<Link href="/login" />}>
              Back to login
            </Button>
          </FieldGroup>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              {error && (
                <FieldDescription className="font-medium text-destructive">
                  {error}
                </FieldDescription>
              )}

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>

                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
