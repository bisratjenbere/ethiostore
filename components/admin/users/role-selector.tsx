"use client";

import { useTransition, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/admin.actions";

type RoleSelectorProps = {
  userId: string;
  currentRole: "user" | "admin";
};

export default function RoleSelector({
  userId,
  currentRole,
}: RoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<"user" | "admin">(currentRole);
  const [displayRole, setDisplayRole] = useState<"user" | "admin">(currentRole);

  const handleRoleChange = (role: "user" | "admin") => {
    setNewRole(role);
    setDialogOpen(true);
  };

  const confirmRoleChange = () => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);

      if (!result.success) {
        toast.error(result.message);
        setDialogOpen(false);
        // Reset to current role if failed
        setNewRole(displayRole);
        return;
      }

      toast.success(result.message);
      setDisplayRole(newRole);
      setDialogOpen(false);
    });
  };

  const handleCancel = () => {
    setNewRole(displayRole);
    setDialogOpen(false);
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={displayRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {displayRole === "admin" && (
          <Badge variant="default" className="ml-2">
            Admin
          </Badge>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role?</AlertDialogTitle>
            <AlertDialogDescription>
              {newRole === "admin" ? (
                <>
                  You are about to promote this user to <strong>Admin</strong>.
                  They will have full access to the admin panel and all
                  management features.
                </>
              ) : (
                <>
                  You are about to demote this user to <strong>User</strong>.
                  They will lose access to the admin panel.
                  <br />
                  <br />
                  <span className="text-destructive">
                    Note: You cannot demote yourself.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
