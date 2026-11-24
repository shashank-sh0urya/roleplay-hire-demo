import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/applications")({
  head: () => pageHead("Application tracker | SmartHire AI", "Follow the status and timeline of your sample job applications."),
  component: () => <SmartHireWorkspace view="applications" />,
});