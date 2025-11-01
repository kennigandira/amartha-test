import { cn } from "@/lib/utils";
import { Spinner } from "../Spinner";

export const ButtonVariant = {
  GREEN: "bg-green-300 hover:bg-green-400",
  ORANGE: "bg-amber-300 hover:bg-amber-400",
} as const;

export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = ({
  variant = ButtonVariant.GREEN,
  loading,
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
      {loading ? <Spinner /> : props.children}
    </button>
  );
};
