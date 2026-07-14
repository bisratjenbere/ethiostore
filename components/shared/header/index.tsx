import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="wrapper">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 transition-transform hover:scale-105">
            <Image
              src="/images/logo.svg"
              height={40}
              width={40}
              priority={true}
              alt={`${APP_NAME} Logo`}
            />
            <span className="hidden lg:block font-bold text-xl tracking-tight">
              {APP_NAME}
            </span>
          </Link>
          
          {/* Menu */}
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
