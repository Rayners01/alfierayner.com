type ClassValue = string | false | null | undefined;

/** Joins conditional class names, dropping anything falsy. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
