"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { Loader } from "lucide-react";

type submitButtonProps = {
  idleText: string;
  pendingText?: string;
  className?: string;
  isPending?: boolean;
};

const SubmitButton = ({
  idleText,
  pendingText,
  className,
  isPending,
}: submitButtonProps) => {
  const { pending } = useFormStatus();
  const isLoading = isPending || pending;
  
  return (
    <Button
      type="submit"
      disabled={isLoading}
      variant="default"
      className={className}
    >
      {isLoading ? (
        <>
          <Loader className="animate-spin h-4 w-4 mr-2" />
          {pendingText || idleText}
        </>
      ) : (
        idleText
      )}
    </Button>
  );
};

export default SubmitButton;
