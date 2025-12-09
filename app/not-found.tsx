"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Link } from "lucide-react";
import Image from "next/image";
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        width={48}
        height={48}
        priority={true}
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
      />
      <div className="p-6 rounded-lg shadow-md w-1/3 text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find Requested Resource</p>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="mt-4 ml-2"
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
