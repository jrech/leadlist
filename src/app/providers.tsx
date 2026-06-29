import type { ReactNode } from "react";

import { LanguageProvider } from "@/i18n/LanguageProvider";

/**
 * Global app providers. Wrap cross-cutting context here (i18n today;
 * theme, query client, analytics later) so the tree has a single seam.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
