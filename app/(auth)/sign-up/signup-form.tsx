"use client";
import { useActionState, useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/lib/actions/user.actions";
import SubmitButton from "@/components/ui/Submit-button ";
import { AlertCircle } from "lucide-react";

const SignUpForm = () => {
  const [data, action, isPending] = useActionState(signUp, {
    message: "",
    success: false,
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            name="name"
            required
            type="name"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={passwordMismatch ? "border-destructive" : ""}
          />
          {passwordMismatch && (
            <p className="text-sm text-destructive mt-1.5">
              Passwords do not match
            </p>
          )}
        </div>
        <div>
          <SubmitButton
            isPending={isPending}
            idleText="Sign Up"
            pendingText="Creating account..."
            className="w-ful"
          />
        </div>
        {data && !data.success && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span><strong>Error:</strong> {data.message}</span>
          </div>
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
