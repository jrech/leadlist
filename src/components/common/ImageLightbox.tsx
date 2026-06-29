import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Minimal full-screen preview overlay — same backdrop/panel pattern as the
 * mobile nav drawer (AppShell), reused here instead of a new dependency.
 */
export function ImageLightbox({ open, onClose, children }: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 max-h-full max-w-2xl animate-slide-up overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
        {children}
      </div>
    </div>
  );
}
