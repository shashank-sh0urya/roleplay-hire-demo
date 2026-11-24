import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/interviews")({
  head: () => pageHead("Interview hub | SmartHire AI", "Review sample interview schedules, details, and preparation links."),
  component: () => <SmartHireWorkspace view="interviews" />,
});