"use client";

import { useQueryStates } from "nuqs";
import { boutiqueSearchParams } from "@/lib/search-params";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

  function toggleArrayValue(key: "marque" | "objectif", value: string) {
    const current = params[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setParams({ [key]: next });
  }

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="recherche-boutique">Rechercher</Label>
        <Input
          id="recherche-boutique"
          className="mt-1.5"
          placeholder="Shampoing, masque..."
          defaultValue={params.recherche}
          onChange={(e) => setParams({ recherche: e.target.value })}
        />
      </div>

      <div>
        <Label>Trier par</Label>
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
        <div>
          <p className="text-sm font-medium">Marques</p>
          <div className="mt-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand.slug} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand.slug}`}
                  checked={params.marque.includes(brand.slug)}
                  onCheckedChange={() => toggleArrayValue("marque", brand.slug)}
                />
                <Label htmlFor={`brand-${brand.slug}`} className="text-sm font-normal">
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {objectives.length > 0 && (
        <div>
          <p className="text-sm font-medium">Objectif</p>
          <div className="mt-2 space-y-2">
            {objectives.map((objectif) => (
              <div key={objectif} className="flex items-center gap-2">
                <Checkbox
                  id={`objectif-${objectif}`}
                  checked={params.objectif.includes(objectif)}
                  onCheckedChange={() => toggleArrayValue("objectif", objectif)}
                />
                <Label htmlFor={`objectif-${objectif}`} className="text-sm font-normal">
                  {objectif}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
