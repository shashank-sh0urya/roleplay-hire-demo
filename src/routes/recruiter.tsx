import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/recruiter")({
  head: () => pageHead("Recruiter studio | SmartHire AI", "Manage fictional job listings, sample applicants, and demo interviews."),
  component: () => <SmartHireWorkspace view="recruiter" />,
});