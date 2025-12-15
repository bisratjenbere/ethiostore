"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";

type submitButtonProps = {
  idleText: string;
  pendingText: string;
  className?: string;
};

const SubmitButton = ({
  idleText,
  pendingText,
  className,
}: submitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="default"
      className={className}
    >
      {pending ? pendingText : idleText}
    </Button>
  );
};

export default SubmitButton;
