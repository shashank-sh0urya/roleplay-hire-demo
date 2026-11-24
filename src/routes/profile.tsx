import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/profile")({
  head: () => pageHead("Candidate profile | SmartHire AI", "Update the candidate details used by SmartHire's sample job matching."),
  component: () => <SmartHireWorkspace view="profile" />,
});