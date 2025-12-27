"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/lib/actions/user.actions";
import SubmitButton from "@/components/ui/Submit-button ";

const SignUpForm = () => {
  const [data, action, isPending] = useActionState(signUp, {
    message: "",
    success: false,
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            type="name"
            autoComplete="name"
          />
        </div>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <SubmitButton
            isPending={isPending}
            idleText="Sign Up"
            className="w-ful"
          />
        </div>
        {data && !data.success && (
          <div className="text-destructive text-center">{data.message}</div>
        )}
        <div className="text-center text-sm text-muted-foreground">
          Alredy have an account?{""}
          <Link target="_self" className="link" href={"/sign-in"}>
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
