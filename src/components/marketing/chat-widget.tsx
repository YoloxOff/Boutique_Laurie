import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { env } from "@/env";

export function ChatWidget() {
  const whatsappUrl = env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ? `https://wa.me/${env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "")}`
    : null;
  const messengerUrl = env.NEXT_PUBLIC_MESSENGER_PAGE_ID
    ? `https://m.me/${env.NEXT_PUBLIC_MESSENGER_PAGE_ID}`
    : null;

  const href = whatsappUrl ?? messengerUrl;
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec nous"
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </Link>
  );
}
