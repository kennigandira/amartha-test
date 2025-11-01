import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GenerateOptionsProps {
  id: number;
  name: string;
}

export function generateOptions(options: GenerateOptionsProps[]) {
  return options.map((item) => {
    return { value: item.id, children: item.name };
  });
}
