import Link from "next/link";
import { cn } from "@/lib/utils";
import { env } from "@/env";

export function BoutonRdv({
  className,
  variant = "solid",
  label = "Prendre rendez-vous",
}: {
  className?: string;
  variant?: "solid" | "outline";
  label?: string;
}) {
  return (
    <Link
      href={env.NEXT_PUBLIC_PLANITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors",
        variant === "solid" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
          "border border-primary/30 text-primary hover:border-primary hover:bg-primary/5",
        className
      )}
    >
      {label}
    </Link>
  );
}
