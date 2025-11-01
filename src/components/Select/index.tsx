import { cn } from "@/lib/utils";
import type { OptionHTMLAttributes } from "react";

type ISelect = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  errorMessage?: string;
};

export const Select = ({
  className: classNameProp,
  options,
  errorMessage,
  ...selectProps
}: ISelect) => {
  const className = cn(
    classNameProp,
    "border rounded-2xl px-3 py-2 w-full cursor-pointer",
    {
      "border-red-500": errorMessage,
      "border-zinc-500": !errorMessage,
    },
  );

  return (
    <div className="w-full">
      <select {...selectProps} className={className}>
        <option disabled selected value=" ">
          Select an option
        </option>
        {options.map((option) => {
          const key = `${option.children}-${option.id}`;
          return (
            <option key={key} {...option}>
              {option.children}
            </option>
          );
        })}
      </select>
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
