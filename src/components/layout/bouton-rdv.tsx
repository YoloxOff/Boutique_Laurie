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
        "inline-flex items-center justify-center text-center rounded-md px-6 py-2.5 text-sm font-semibold tracking-wide shadow-sm transition-all",
        variant === "solid" && "bg-[#c39c51] text-white hover:bg-[#b8923a]",
        variant === "outline" &&
          "border border-[#e6d5a3] text-stone-800 hover:bg-[#c39c5112]",
        className
      )}
    >
      {label}
    </Link>
  );
}
