"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminUser, initialAdminUserFormState } from "@/lib/admin/users-actions";
import { PERMISSIONS } from "@/lib/admin/permission-keys";

export function AdminUserCreateForm() {
  const [state, formAction, isPending] = useActionState(createAdminUser, initialAdminUserFormState);
  const [role, setRole] = useState("employee");

  return (
    <form action={formAction} className="grid max-w-2xl gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe temporaire</Label>
        <Input id="password" name="password" type="password" minLength={8} required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="role-select">Rôle</Label>
        <Select value={role} onValueChange={(v) => setRole(v ?? "employee")}>
          <SelectTrigger id="role-select" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employé</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="role" value={role} />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium">Permissions</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PERMISSIONS.map((p) => (
            <label key={p.key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="permissions" value={p.key} className="size-4 rounded border-border" />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && <p className="sm:col-span-2 text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Création…" : "Créer le compte"}
      </Button>
    </form>
  );
}
