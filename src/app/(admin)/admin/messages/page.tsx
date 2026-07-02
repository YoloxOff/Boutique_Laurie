import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageReplyForm } from "@/components/forms/message-reply-form";
import { db, isDatabaseConfigured } from "@/db";
import { contactMessages } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { assertPagePermission } from "@/lib/admin/permissions";
import { bulkArchiveMessages, bulkDeleteMessages } from "@/lib/admin/messages-actions";

export const metadata: Metadata = { title: "Admin — Messages" };

const STATUSES = [
  { value: "", label: "Tous" },
  { value: "new", label: "Nouveaux" },
  { value: "replied", label: "Répondus" },
  { value: "archived", label: "Archivés" },
] as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await assertPagePermission("messages");
  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Messages</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour voir les messages réels ici.
        </p>
      </div>
    );
  }

  const { status = "" } = await searchParams;
  const validStatus = STATUSES.some((s) => s.value === status) && status ? status : undefined;

  const messages = await db.query.contactMessages.findMany({
    where: validStatus ? eq(contactMessages.status, validStatus) : undefined,
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl">Messages ({messages.length})</h1>
        <Button variant="secondary" render={<Link href="/api/admin/messages/export" />}>
          Exporter en CSV
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={status === s.value ? "default" : "outline"}
            render={<Link href={`/admin/messages${s.value ? `?status=${s.value}` : ""}`} />}
          >
            {s.label}
          </Button>
        ))}
      </div>

      <form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" type="submit" formAction={bulkArchiveMessages}>
            Archiver la sélection
          </Button>
          <Button size="sm" variant="destructive" type="submit" formAction={bulkDeleteMessages}>
            Supprimer la sélection
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-xl border border-border p-4">
              <input type="checkbox" name="ids" value={m.id} className="mt-1 size-4 shrink-0 rounded border-border" />
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium break-all">
                    {m.name} — {m.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.status === "new" ? "default" : "secondary"}>{m.status}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(m.createdAt.toISOString())}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{m.message}</p>
                <div className="mt-3">
                  <MessageReplyForm id={m.id} email={m.email} />
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-muted-foreground">Aucun message.</p>}
        </div>
      </form>
    </div>
  );
}
