import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/")({
  head: () => pageHead(
    "SmartHire AI | Your career workspace",
    "Explore sample roles, track applications, and prepare for interviews in your SmartHire career workspace.",
  ),
  component: () => <SmartHireWorkspace view="dashboard" />,
});
