import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PaginationControls({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Page {page} / {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          render={<Link href={buildHref(Math.max(1, page - 1))} />}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          render={<Link href={buildHref(Math.min(totalPages, page + 1))} />}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
