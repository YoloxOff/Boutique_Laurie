"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { updateAdminUser, toggleSuspendAdminUser, deleteAdminUser } from "@/lib/admin/users-actions";
import { PERMISSIONS } from "@/lib/admin/permission-keys";

type AdminUserRowProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    permissions: string[];
    suspendedAt: Date | null;
  };
  currentUserId?: string;
};

export function AdminUserRow({ user, currentUserId }: AdminUserRowProps) {
  const [editing, setEditing] = useState(false);
  const isSuperAdmin = user.role === "super_admin";

  return (
    <>
      <TableRow>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
        </TableCell>
        <TableCell>{isSuperAdmin ? "Toutes" : user.permissions.join(", ") || "—"}</TableCell>
        <TableCell>
          <Badge variant={user.suspendedAt ? "destructive" : "secondary"}>
            {user.suspendedAt ? "Suspendu" : "Actif"}
          </Badge>
        </TableCell>
        <TableCell className="flex flex-wrap gap-2">
          {isSuperAdmin ? (
            <span className="text-xs text-muted-foreground">Compte principal</span>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
                {editing ? "Fermer" : "Modifier"}
              </Button>
              <form action={toggleSuspendAdminUser.bind(null, user.id, !user.suspendedAt)}>
                <Button size="sm" variant="outline" type="submit">
                  {user.suspendedAt ? "Réactiver" : "Suspendre"}
                </Button>
              </form>
              {currentUserId !== user.id && (
                <form
                  action={deleteAdminUser.bind(null, user.id)}
                  onSubmit={(e) => {
                    if (!confirm(`Supprimer le compte ${user.email} ?`)) e.preventDefault();
                  }}
                >
                  <Button size="sm" variant="destructive" type="submit">
                    Supprimer
                  </Button>
                </form>
              )}
            </>
          )}
        </TableCell>
      </TableRow>
      {editing && (
        <TableRow>
          <TableCell colSpan={6}>
            <form action={updateAdminUser} className="flex flex-wrap items-center gap-4 py-2">
              <input type="hidden" name="id" value={user.id} />
              <select name="role" defaultValue={user.role} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                <option value="employee">Employé</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="flex flex-wrap gap-3">
                {PERMISSIONS.map((p) => (
                  <label key={p.key} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      name="permissions"
                      value={p.key}
                      defaultChecked={user.permissions.includes(p.key)}
                      className="size-4 rounded border-border"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
              <Button size="sm" type="submit">
                Enregistrer
              </Button>
            </form>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
