import { createFileRoute } from "@tanstack/react-router";
import { SmartHireWorkspace, pageHead } from "@/components/smart-hire-workspace";

export const Route = createFileRoute("/hiremate")({
  head: () => pageHead("HireMate career assistant | SmartHire AI", "Get predefined demo guidance for resumes, interviews, and job searching."),
  component: () => <SmartHireWorkspace view="hiremate" />,
});