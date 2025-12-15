"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SubmitButton from "@/components/ui/Submit-button ";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    message: "",
    success: false,
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Signing In..." : "Sign In with credentials"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <SubmitButton
            idleText="Sign In with credentials"
            className="w-full"
            pendingText="Signing In..."
          />
        </div>
        {data && !data.success && (
          <div className="text-destructive text-center">{data.message}</div>
        )}
        <div className="text-center text-sm text-muted-foreground">
          don&apos;t have an account?{""}
          <Link target="_self" className="link" href={"/sign-up"}>
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
