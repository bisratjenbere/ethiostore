import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { Children } from "react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex h-16 items-center px-4">
            <Link className="w-22" href="/">
              <Image
                src="/images/logo.svg"
                height={48}
                width={48}
                alt={`${APP_NAME} Logos`}
              />
            </Link>
            <div className="flex ml-auto space-x-4 items-center">
              <p>Menu INjected Here</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 mx-auto container p-8 pt-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
