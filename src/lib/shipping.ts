export type ShippingMethod = "click_collect" | "domicile" | "mondial_relay" | "colissimo";

export const SHIPPING_METHODS: {
  value: ShippingMethod;
  label: string;
  description: string;
  freeAbove: number | null;
  price: number;
}[] = [
  {
    value: "click_collect",
    label: "Click & Collect",
    description: "Retrait gratuit au salon sous 24-48h",
    freeAbove: null,
    price: 0,
  },
  {
    value: "mondial_relay",
    label: "Mondial Relay",
    description: "Livraison en point relais sous 2-4 jours ouvrés",
    freeAbove: 49,
    price: 3.9,
  },
  {
    value: "colissimo",
    label: "Colissimo",
    description: "Livraison à domicile avec suivi sous 2-3 jours ouvrés",
    freeAbove: 49,
    price: 5.9,
  },
  {
    value: "domicile",
    label: "Livraison express à domicile",
    description: "Livraison sous 24h (zone éligible uniquement)",
    freeAbove: 79,
    price: 9.9,
  },
];

/**
 * Tarifs V1 simules par paliers. L'integration reelle des API transporteurs
 * (points relais Mondial Relay, etiquettes Colissimo) est prevue en V2 une fois
 * les contrats transporteur signes (cf. plan).
 */
export function getShippingPrice(method: ShippingMethod, subtotal: number): number {
  const config = SHIPPING_METHODS.find((m) => m.value === method);
  if (!config) return 0;
  if (config.freeAbove !== null && subtotal >= config.freeAbove) return 0;
  return config.price;
}
