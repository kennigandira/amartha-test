import { cn } from "@/lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
}

const classes = {
  container: "w-full",
  textarea: (disabled?: boolean, errorMessage?: string, className?: string) =>
    cn(className, "border rounded-2xl px-3 py-2 w-full", {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    }),
  errorMessage: "text-red-600 text-sm mt-1",
};

export const TextArea = ({
  errorMessage,
  className: classNameProp,
  disabled,
  ...props
}: TextAreaProps) => {
  return (
    <div className={classes.container}>
      <textarea
        {...props}
        disabled={disabled}
        className={classes.textarea(disabled, errorMessage, classNameProp)}
      />
      {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
    </div>
  );
};
