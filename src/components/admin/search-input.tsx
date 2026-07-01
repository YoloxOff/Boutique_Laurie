import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput({
  defaultValue,
  placeholder,
  action,
}: {
  defaultValue?: string;
  placeholder: string;
  action: string;
}) {
  return (
    <form action={action} method="GET" className="flex max-w-sm gap-2">
      <Input name="q" defaultValue={defaultValue} placeholder={placeholder} />
      <Button type="submit" variant="secondary">
        Rechercher
      </Button>
    </form>
  );
}
