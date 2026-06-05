import type { PropsWithChildren } from "react";
import { requireRole } from "@/lib/auth/require-role";

export default async function GuardianLayout({ children }: PropsWithChildren) {
  await requireRole(["guardian", "admin"]);
  return children;
}
