import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const classes = {
  input: (disabled?: boolean, errorMessage?: string, className?: string) =>
    cn(className, "border rounded-2xl px-3 py-2 w-full", {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    }),
  errorMessage: "text-red-600 text-sm mt-1",
  inputContainer: "w-full",
};

export const Input = ({
  errorMessage,
  className: classNameProp,
  disabled,
  ...props
}: InputProps) => {
  const className = classes.input(disabled, errorMessage, classNameProp);

  return (
    <div className={classes.inputContainer}>
      <input {...props} disabled={disabled} className={className} />
      {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
    </div>
  );
};
