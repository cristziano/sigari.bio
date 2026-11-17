import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** join class names; later Tailwind classes win over earlier ones (shadcn helper) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
