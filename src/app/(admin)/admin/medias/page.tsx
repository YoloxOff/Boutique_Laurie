import type { Metadata } from "next";
import { ilike } from "drizzle-orm";
import { SearchInput } from "@/components/admin/search-input";
import { FolderSelect } from "@/components/admin/folder-select";
import { MediaUploadForm } from "@/components/forms/media-upload-form";
import { MediaCard } from "@/components/forms/media-card";
import { db, isDatabaseConfigured } from "@/db";
import { media } from "@/db/schema";
import { assertPagePermission } from "@/lib/admin/permissions";
import { env } from "@/env";

export const metadata: Metadata = { title: "Admin — Médiathèque" };

export default async function AdminMediasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; folder?: string }>;
}) {
  await assertPagePermission("media");

  if (!isDatabaseConfigured) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Médiathèque</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Mode démo : configurez Neon (DATABASE_URL) pour utiliser la médiathèque.
        </p>
      </div>
    );
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return (
      <div>
        <h1 className="font-heading text-2xl">Médiathèque</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Configurez Vercel Blob (BLOB_READ_WRITE_TOKEN) pour activer l&apos;envoi de photos.
        </p>
      </div>
    );
  }

  const { q = "", folder = "" } = await searchParams;

  const items = await db.query.media.findMany({
    where: q ? ilike(media.name, `%${q}%`) : undefined,
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });
  const filtered = folder ? items.filter((i) => i.folder === folder) : items;
  const folders = [...new Set(items.map((i) => i.folder).filter(Boolean))];

  return (
    <div>
      <h1 className="font-heading text-2xl">Médiathèque ({items.length})</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Photos compressées et converties automatiquement en WebP. Copiez l&apos;URL pour la
        réutiliser dans les fiches produits, la galerie, etc.
      </p>

      <div className="mt-6 rounded-xl border border-border p-4">
        <MediaUploadForm currentFolder={folder} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput defaultValue={q} placeholder="Rechercher un nom…" action="/admin/medias" />
        {folders.length > 0 && <FolderSelect folders={folders} current={folder} />}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">Aucune image.</p>
        )}
      </div>
    </div>
  );
}
