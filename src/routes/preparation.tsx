import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/preparation")({
  head: () => pageHead("Interview preparation plan | SmartHire AI", "Build a focused seven-day practice plan for a sample company and role."),
  component: () => <SmartHireWorkspace view="preparation" />,
});