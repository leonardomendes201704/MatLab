import type { PropsWithChildren } from "react";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminLayout({ children }: PropsWithChildren) {
  await requireRole(["admin"]);
  return children;
}
