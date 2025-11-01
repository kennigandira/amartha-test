import { cn } from "@/lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
}

export const TextArea = ({
  errorMessage,
  className: classNameProp,
  disabled,
  ...props
}: TextAreaProps) => {
  const className = cn(
    classNameProp,
    "border rounded-2xl px-3 py-2 w-full",
    {
      "bg-gray-200": disabled,
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    },
  );

  return (
    <div className="w-full">
      <textarea {...props} disabled={disabled} className={className} />
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
