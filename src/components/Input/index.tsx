import { cn } from "@/lib/utils";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const className = cn(
    props.className,
    "border border-zinc-500 rounded-2xl px-3 py-2 w-full",
    { "bg-gray-200": props.disabled },
  );

  return <input {...props} className={className} />;
};
