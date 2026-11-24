import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications | SmartHire AI", "Review application, interview, and job updates in your demo workspace."),
  component: () => <SmartHireWorkspace view="notifications" />,
});