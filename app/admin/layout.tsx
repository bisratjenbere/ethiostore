import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/layout/admin-sidebar";
import AdminHeader from "@/components/admin/layout/admin-header";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader session={session} />
        <main className="flex-1 overflow-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
