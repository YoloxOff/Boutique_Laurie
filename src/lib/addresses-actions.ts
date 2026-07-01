"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db, isDatabaseConfigured } from "@/db";
import { addresses } from "@/db/schema";

export type AddressFormState = { error: string | null };

export async function addAddress(
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  if (!isDatabaseConfigured) {
    return { error: "Mode démo : la gestion des adresses nécessite Neon (DATABASE_URL)." };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Vous devez être connecté." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const line1 = String(formData.get("line1") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();

  if (!fullName || !line1 || !city || !postalCode) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  await db.insert(addresses).values({
    userId: session.user.id,
    fullName,
    line1,
    city,
    postalCode,
    label: String(formData.get("label") ?? "Domicile"),
  });

  revalidatePath("/compte/adresses");
  return { error: null };
}
