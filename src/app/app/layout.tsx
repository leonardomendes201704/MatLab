import type { PropsWithChildren } from "react";
import { requireRole } from "@/lib/auth/require-role";

export default async function StudentLayout({ children }: PropsWithChildren) {
  await requireRole(["student", "admin"]);
  return children;
}
