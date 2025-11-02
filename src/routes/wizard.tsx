import { Step1Form } from "@/components/Step1Form";
import { Step2Form } from "@/components/Step2Form";
import { WizardIntro } from "@/components/WizardIntro";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export type WizardSearch = {
  role?: "admin" | "ops";
};

export const Route = createFileRoute("/wizard")({
  validateSearch: (search: Record<string, string>): WizardSearch => {
    return {
      role: search.role as "admin" | "ops",
    };
  },
  component: Wizard,
});

const classes = {
  container: "p-8 text-center max-w-96 w-full",
  formContainer: "flex flex-col gap-2",
};

function Wizard() {
  const search = useSearch({ from: "/wizard" });
  const renderContent = () => {
    switch (search.role) {
      case "admin":
        return <Step1Form />;
      case "ops":
        return <Step2Form />;
      default:
        return <WizardIntro />;
    }
  };

  return (
    <form className={classes.container}>
      <div className={classes.formContainer}>{renderContent()}</div>
    </form>
  );
}
