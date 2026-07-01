"use client";

export function FolderSelect({ folders, current }: { folders: string[]; current: string }) {
  return (
    <select
      defaultValue={current}
      onChange={(e) => {
        const url = new URL(window.location.href);
        if (e.target.value) url.searchParams.set("folder", e.target.value);
        else url.searchParams.delete("folder");
        window.location.href = url.toString();
      }}
      className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
    >
      <option value="">Tous les dossiers</option>
      {folders.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}
