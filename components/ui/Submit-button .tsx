"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { Loader } from "lucide-react";

type submitButtonProps = {
  idleText: string;
  className?: string;
  isPending?: boolean;
};

const SubmitButton = ({
  idleText,
  className,
  isPending,
}: submitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="default"
      className={className}
    >
      {isPending ? <Loader className="animate-spin h-4 w-4" /> : idleText}
    </Button>
  );
};

export default SubmitButton;
