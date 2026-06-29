import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useLanguage } from "@/i18n/LanguageProvider";

interface CopyButtonProps extends Pick<ButtonProps, "size" | "variant"> {
  text: string;
  /** Renders just the icon (in an icon-sized button) — for compact toolbars. */
  iconOnly?: boolean;
}

/** Copy-to-clipboard button with transient "copied" feedback. */
export function CopyButton({
  text,
  size = "sm",
  variant = "secondary",
  iconOnly = false,
}: CopyButtonProps) {
  const { t } = useLanguage();
  const { copied, copy } = useCopyToClipboard();

  if (iconOnly) {
    return (
      <Button
        size="icon"
        variant={variant}
        onClick={() => copy(text)}
        title={copied ? t.copiedLabel : t.copyLabel}
        aria-label={copied ? t.copiedLabel : t.copyLabel}
      >
        {copied ? <Check className="text-success" /> : <Copy />}
      </Button>
    );
  }

  return (
    <Button size={size} variant={variant} onClick={() => copy(text)}>
      {copied ? <Check className="text-success" /> : <Copy />}
      {copied ? t.copiedLabel : t.copyLabel}
    </Button>
  );
}
