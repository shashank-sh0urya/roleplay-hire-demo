import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/admin")({
  head: () => pageHead("Admin overview | SmartHire AI", "Review sample users, listings, and activity in the SmartHire demo."),
  component: () => <SmartHireWorkspace view="admin" />,
});