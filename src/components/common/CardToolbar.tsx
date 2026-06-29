import { Check, Pencil, RotateCw } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";

interface CardToolbarProps {
  copyText: string;
  editing: boolean;
  onToggleEdit: () => void;
  onRegenerate: () => void;
  regenerating?: boolean;
}

/**
 * Compact icon toolbar shown once a card has content: Edit, Regenerate,
 * Copy. Replaces the big primary "Generate" CTA once an artifact exists —
 * keeps the card to one visual mode at a time.
 */
export function CardToolbar({
  copyText,
  editing,
  onToggleEdit,
  onRegenerate,
  regenerating = false,
}: CardToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleEdit}
        title={editing ? "Done" : "Edit"}
        aria-label={editing ? "Done editing" : "Edit"}
      >
        {editing ? <Check className="text-success" /> : <Pencil />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onRegenerate}
        loading={regenerating}
        title="Regenerate"
        aria-label="Regenerate"
      >
        {!regenerating && <RotateCw />}
      </Button>
      <CopyButton text={copyText} variant="ghost" iconOnly />
    </div>
  );
}
