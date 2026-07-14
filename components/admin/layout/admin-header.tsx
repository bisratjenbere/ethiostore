"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { signOutUser } from "@/lib/actions/user.actions";
import type { Session } from "next-auth";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const navItem = navItems.find((item) => item.href === path);
    breadcrumbs.push({
      label: navItem?.title || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: path,
    });
  }

  return breadcrumbs;
}

export default function AdminHeader({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  const captitalizedName = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center border-b bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="border-b p-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{APP_NAME}</h1>
                  <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                    Admin
                  </span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Menu */}
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 w-8 flex items-center ml-2 relative justify-center rounded-full bg-gray-300"
              variant="ghost"
            >
              {captitalizedName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link href="/" className="w-full">
                <Button
                  className="justify-start w-full py-4 px-2 h-4"
                  variant="ghost"
                >
                  Back to Store
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 mb-1">
              <form className="w-full" action={signOutUser}>
                <Button
                  className="justify-start w-full py-4 px-2 h-4"
                  variant="ghost"
                >
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
