import { LinkButton } from "../LinkButton";

export const WizardIntro = () => {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Add employee as?</h2>
      <div className="flex justify-center gap-2">
        <LinkButton to="/wizard" search={{ role: "admin" }}>
          Admin
        </LinkButton>
        <LinkButton to="/wizard" search={{ role: "ops" }}>
          Ops
        </LinkButton>
      </div>
    </div>
  );
};
