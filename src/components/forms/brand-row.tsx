"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteBrand } from "@/lib/admin/brands-actions";

export function BrandRow({ brand, productCount }: { brand: { id: string; name: string }; productCount: number }) {
  return (
    <TableRow>
      <TableCell>{brand.name}</TableCell>
      <TableCell>{productCount}</TableCell>
      <TableCell>
        <form
          action={deleteBrand.bind(null, brand.id)}
          onSubmit={(e) => {
            const message =
              productCount > 0
                ? `Supprimer "${brand.name}" ? ${productCount} produit(s) n'auront plus de marque.`
                : `Supprimer la marque "${brand.name}" ?`;
            if (!confirm(message)) e.preventDefault();
          }}
        >
          <Button size="sm" variant="destructive" type="submit">
            Supprimer
          </Button>
        </form>
      </TableCell>
    </TableRow>
  );
}
