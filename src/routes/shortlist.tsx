import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/shortlist")({
  head: () => pageHead("Shortlisted roles | SmartHire AI", "Review and manage the sample roles you have saved for later."),
  component: () => <SmartHireWorkspace view="shortlist" />,
});