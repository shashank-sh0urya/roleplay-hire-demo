import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/companies")({
  head: () => pageHead("Company directory | SmartHire AI", "Explore fictional company profiles and sample interview topics."),
  component: () => <SmartHireWorkspace view="companies" />,
});