import { createFileRoute } from "@tanstack/react-router";

export type WizardSearch = {
  role?: "admin" | "ops";
};

export const Route = createFileRoute("/wizard")({
  component: Wizard,
});

function Wizard() {
  return "Wizard";
}
