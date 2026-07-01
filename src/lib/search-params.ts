import { parseAsString, parseAsArrayOf, createLoader } from "nuqs/server";

export const boutiqueSearchParams = {
  recherche: parseAsString.withDefault(""),
  marque: parseAsArrayOf(parseAsString).withDefault([]),
  objectif: parseAsArrayOf(parseAsString).withDefault([]),
  tri: parseAsString.withDefault("pertinence"),
};

export const loadBoutiqueSearchParams = createLoader(boutiqueSearchParams);
