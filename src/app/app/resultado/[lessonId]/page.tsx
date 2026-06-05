import { AppShell } from "@/components/AppShell";
import { ResultSummary } from "@/components/student/ResultSummary";

export default function ResultPage() {
  return <AppShell><ResultSummary xp={40} accuracy={80} /></AppShell>;
}
