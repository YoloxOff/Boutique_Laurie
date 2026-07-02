import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convertit un numéro français local ("06 84 97 21 77") en lien wa.me international. */
export function toWhatsAppUrl(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null
  const international = digits.startsWith("0") ? `33${digits.slice(1)}` : digits
  return `https://wa.me/${international}`
}
