import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Language } from "@/types/domain";

const OPTIONS: Language[] = ["cs", "en"];

/** Compact CS / EN segmented toggle. UI-only — reads the i18n context. */
export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5">
      {OPTIONS.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
