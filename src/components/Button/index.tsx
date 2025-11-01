import { cn } from "@/lib/utils";

export const ButtonVariant = {
  GREEN: "bg-green-300 hover:bg-green-400",
  ORANGE: "bg-amber-300 hover:bg-amber-400",
} as const;

export const ButtonAs = {
  LINK: "link",
  BUTTON: "button",
} as const;

export type ButtonAs = (typeof ButtonAs)[keyof typeof ButtonAs];
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  as?: ButtonAs;
}

export const Button = ({
  variant = ButtonVariant.GREEN,
  ...props
}: IButton) => {
  const className = cn(
    props.className,
    "px-5 py-2 text-sm font-semibold rounded-full transition-all",
    {
      "hover:-translate-y-2 cursor-pointer": !props.disabled,
      "opacity-50 cursor-not-allowed": props.disabled,
    },
    variant,
  );

  return (
    <button {...props} className={className}>
      {props.children}
    </button>
  );
};
