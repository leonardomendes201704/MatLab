import type { PropsWithChildren } from "react";
import { SidebarAdmin } from "@/components/admin/SidebarAdmin";

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdmin />
      <main className="w-full p-4 md:p-8">{children}</main>
    </div>
  );
}
