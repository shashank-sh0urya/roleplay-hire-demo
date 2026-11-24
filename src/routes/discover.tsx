import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/discover")({
  head: () => pageHead("Discover roles | SmartHire AI", "Browse sample job listings and compare each role with your profile skills."),
  component: () => <SmartHireWorkspace view="discover" />,
});