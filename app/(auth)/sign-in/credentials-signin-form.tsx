"use client";
import { useActionState } from "react";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import SubmitButton from "@/components/ui/Submit-button ";
import { AlertCircle } from "lucide-react";

const CredentialsSignInForm = () => {
  const [data, action, isPending] = useActionState(signInWithCredentials, {
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
          />
        </div>
        <div>
          <SubmitButton
            idleText="Sign In with credentials"
            className="w-full"
            isPending={isPending}
          />
        </div>
        {data && !data.success && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span><strong>Error:</strong> {data.message}</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
