"use client";

import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();

  return (
    <nav {...props}>
      {navLinks.map((item) => {
        return (
          <Link key={item.href} href={item.href}>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
