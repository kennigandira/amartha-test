import { cn } from "@/lib/utils";
import type { OptionHTMLAttributes } from "react";

type ISelect = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
};

export const Select = ({
  className: classNameProp,
  options,
  ...props
}: ISelect) => {
  const className = cn(
    classNameProp,
    "border border-zinc-500 rounded-2xl px-3 py-2 w-full cursor-pointer",
  );

  return (
    <select {...props} className={className}>
      {options.map((option) => {
        const key = `${option.children}-${option.id}`;
        return (
          <option key={key} {...option}>
            {option.children}
          </option>
        );
      })}
    </select>
  );
};
