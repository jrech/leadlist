import { Textarea } from "@/components/common/Textarea";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  /** Monospace for prompt-shaped text (default); off for prose like emails. */
  mono?: boolean;
  rows?: number;
}

/**
 * Renders a generated text block as read-only text, or as a textarea when
 * in edit mode. The toggle itself lives in the parent (CardToolbar) — this
 * component only renders the current mode.
 */
export function EditableText({
  value,
  editing,
  onChange,
  mono = true,
  rows = 12,
}: EditableTextProps) {
  const fontClass = mono ? "font-mono text-[12.5px]" : "font-sans text-sm";

  if (editing) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={cn(fontClass, "leading-relaxed")}
        autoFocus
      />
    );
  }

  return (
    <pre
      className={cn(
        fontClass,
        "animate-fade-in whitespace-pre-wrap break-words leading-relaxed text-foreground/85",
      )}
    >
      {value}
    </pre>
  );
}
