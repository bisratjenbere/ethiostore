import { Metadata } from "next";
import { getAllUsers } from "@/lib/actions/admin.actions";
import AdminUsersTable from "@/components/admin/users/admin-users-table";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "User Management",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    role?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const role = params.role || "all";
  const search = params.search || "";

  const result = await getAllUsers({
    page: Number(page),
    limit: 50,
    role,
    search,
  });

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">{result.message}</p>
        </div>
      </div>
    );
  }

  const data = result.data;
  const { users, total, pages, currentPage } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts ({total} total)
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AdminUsersTable
          users={users.map(user => ({
            ...user,
            createdAt: typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString(),
          }))}
          currentPage={currentPage}
          totalPages={pages}
          filters={{
            role,
            search,
          }}
        />
      </Suspense>
    </div>
  );
}
