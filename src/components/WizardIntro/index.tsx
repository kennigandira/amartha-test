import { LinkButton } from "../LinkButton";

const classes = {
  container: "flex flex-col items-center justify-center",
  title: "font-bold text-2xl mb-4",
  buttonsContainer: "flex justify-center gap-2",
};

const TEXTS = {
  TITLE: "Add employee as?",
  ADMIN: "Admin",
  OPS: "Ops",
};

export const WizardIntro = () => {
  return (
    <div>
      <h2 className={classes.title}>{TEXTS.TITLE}</h2>
      <div className={classes.buttonsContainer}>
        <LinkButton to="/wizard" search={{ role: "admin" }}>
          {TEXTS.ADMIN}
        </LinkButton>
        <LinkButton to="/wizard" search={{ role: "ops" }}>
          {TEXTS.OPS}
        </LinkButton>
      </div>
    </div>
  );
};
