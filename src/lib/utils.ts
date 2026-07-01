import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely, so conditional classes never fight
 * with each other (e.g. two different `px-*` values). This is the standard
 * shadcn/ui helper - used by every UI primitive in `src/components/ui`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
