import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/mock-interview")({
  head: () => pageHead("Mock interview practice | SmartHire AI", "Practice sample interview questions and review structured demo feedback."),
  component: () => <SmartHireWorkspace view="mock-interview" />,
});