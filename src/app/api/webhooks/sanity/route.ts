import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { env } from "@/env";

type SanityWebhookPayload = { _type?: string };

export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Revalidation non configurée (SANITY_REVALIDATE_SECRET manquant)" }, { status: 503 });
  }

  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
      req,
      env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Signature invalide" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
    }

    revalidateTag(body._type, { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    return NextResponse.json({ message: "Erreur webhook", error: String(err) }, { status: 500 });
  }
}
