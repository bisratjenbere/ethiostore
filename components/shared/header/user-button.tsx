import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";

import { UserIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon />
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  const captitalizedName = session.user?.name?.charAt(0).toUpperCase() ?? "";
  return (
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
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {session.user?.role === "admin" && (
            <DropdownMenuItem className="p-0">
              <Link href="/admin/dashboard" className="w-full">
                <Button
                  className="justify-start w-full py-4 px-2 h-4"
                  variant="ghost"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0">
            <Link href="/user/orders" className="w-full">
              <Button
                className="justify-start w-full py-4 px-2 h-4"
                variant="ghost"
              >
                My Orders
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
  );
};

export default UserButton;
