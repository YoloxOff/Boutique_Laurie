"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reorderProducts } from "@/lib/admin/products-actions";

type OrderItem = {
  id: string;
  name: string;
  brandName: string | null;
  imageUrl: string | null;
};

export function ProductOrderManager({ items: initialItems }: { items: OrderItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function persist(next: OrderItem[]) {
    setItems(next);
    startTransition(() => {
      reorderProducts(next.map((item) => item.id));
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    persist(arrayMove(items, oldIndex, newIndex));
  }

  function move(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    persist(arrayMove(items, index, targetIndex));
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground">Aucun produit à réorganiser.</p>;
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <SortableRow
                key={item.id}
                item={item}
                index={index}
                isLast={index === items.length - 1}
                onMove={move}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {isPending ? "Enregistrement…" : "Ordre enregistré."}
      </p>
    </div>
  );
}

function SortableRow({
  item,
  index,
  isLast,
  onMove,
}: {
  item: OrderItem;
  index: number;
  isLast: boolean;
  onMove: (index: number, direction: "up" | "down") => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg border border-border bg-card p-2 ${isDragging ? "z-10 shadow-md" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
        aria-label={`Réordonner ${item.name}`}
      >
        <GripVertical className="size-4" />
      </button>

      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill sizes="40px" className="object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        {item.brandName && <p className="truncate text-xs text-muted-foreground">{item.brandName}</p>}
      </div>

      <div className="flex gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          aria-label={`Monter ${item.name}`}
        >
          <ChevronUp />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          disabled={isLast}
          onClick={() => onMove(index, "down")}
          aria-label={`Descendre ${item.name}`}
        >
          <ChevronDown />
        </Button>
      </div>
    </li>
  );
}
