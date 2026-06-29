import {
  Bold,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  /** HTML content. Only re-synced into the editor when it changes externally. */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButtonDef {
  icon: LucideIcon;
  command: string;
  label: string;
}

const TOOLBAR: ToolbarButtonDef[] = [
  { icon: Bold, command: "bold", label: "Bold" },
  { icon: Italic, command: "italic", label: "Italic" },
  { icon: List, command: "insertUnorderedList", label: "Bulleted list" },
  { icon: ListOrdered, command: "insertOrderedList", label: "Numbered list" },
];

/**
 * A small, dependency-free rich text editor: a contentEditable surface plus
 * a 4-button formatting toolbar. Deliberately not Tiptap/Lexical — those are
 * the right call for a production notes feature, but this keeps the bundle
 * and the mental model small for what's still a mock-data milestone.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts as `null` (never a valid value) so the first render always syncs
  // the initial content into the DOM — contentEditable isn't controlled,
  // so nothing else would populate it on mount.
  const lastValue = useRef<string | null>(null);

  // Only push `value` into the DOM when it changed from outside this
  // component (e.g. switching leads, or the initial load) — never on our
  // own onInput round-trip, which would otherwise reset the caret on every
  // keystroke.
  useEffect(() => {
    if (ref.current && value !== lastValue.current) {
      ref.current.innerHTML = value;
      lastValue.current = value;
    }
  }, [value]);

  const exec = (command: string) => {
    document.execCommand(command);
    if (ref.current) {
      lastValue.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
        {TOOLBAR.map(({ icon: Icon, command, label }) => (
          <button
            key={command}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(command)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        ))}
      </div>
      <div className="relative">
        {isEmpty && placeholder && (
          <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground/60">
            {placeholder}
          </span>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            lastValue.current = e.currentTarget.innerHTML;
            onChange(e.currentTarget.innerHTML);
          }}
          className="min-h-[120px] px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc"
        />
      </div>
    </div>
  );
}
