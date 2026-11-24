import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/resume-assistant")({
  head: () => pageHead("Resume assistant | SmartHire AI", "Edit a sample resume draft and compare it with a job description."),
  component: () => <SmartHireWorkspace view="resume-assistant" />,
});