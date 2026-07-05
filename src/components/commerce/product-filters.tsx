"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useQueryStates } from "nuqs";
import { boutiqueSearchParams } from "@/lib/search-params";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductFilters({
  brands,
  objectives,
}: {
  brands: { slug: string; name: string }[];
  objectives: string[];
}) {
  const [params, setParams] = useQueryStates(boutiqueSearchParams, { shallow: false });

  const hasActiveFilters =
    params.recherche !== "" || params.marque.length > 0 || params.objectif.length > 0 || params.tri !== "pertinence";

  function toggleArrayValue(key: "marque" | "objectif", value: string) {
    const current = params[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setParams({ [key]: next });
  }

  function resetFilters() {
    setParams({ recherche: "", marque: [], objectif: [], tri: "pertinence" });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-accent-foreground/70" />
          <h3 className="font-heading text-lg">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <Separator />

      <div>
        <Label htmlFor="recherche-boutique" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Rechercher
        </Label>
        <div className="relative mt-1.5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="recherche-boutique"
            className="pl-8"
            placeholder="Shampoing, masque..."
            defaultValue={params.recherche}
            onChange={(e) => setParams({ recherche: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trier par</Label>
        <Select value={params.tri} onValueChange={(v) => setParams({ tri: v })}>
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pertinence">Pertinence</SelectItem>
            <SelectItem value="prix-asc">Prix croissant</SelectItem>
            <SelectItem value="prix-desc">Prix décroissant</SelectItem>
            <SelectItem value="nom">Nom (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {brands.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Marques</p>
            <div className="mt-3 space-y-2.5">
              {brands.map((brand) => (
                <div key={brand.slug} className="group flex items-center gap-2.5">
                  <Checkbox
                    id={`brand-${brand.slug}`}
                    checked={params.marque.includes(brand.slug)}
                    onCheckedChange={() => toggleArrayValue("marque", brand.slug)}
                  />
                  <Label
                    htmlFor={`brand-${brand.slug}`}
                    className="cursor-pointer text-sm font-normal text-foreground/80 transition-colors group-hover:text-foreground"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {objectives.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Objectif</p>
            <div className="mt-3 space-y-2.5">
              {objectives.map((objectif) => (
                <div key={objectif} className="group flex items-center gap-2.5">
                  <Checkbox
                    id={`objectif-${objectif}`}
                    checked={params.objectif.includes(objectif)}
                    onCheckedChange={() => toggleArrayValue("objectif", objectif)}
                  />
                  <Label
                    htmlFor={`objectif-${objectif}`}
                    className="cursor-pointer text-sm font-normal text-foreground/80 transition-colors group-hover:text-foreground"
                  >
                    {objectif}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
