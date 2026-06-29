import { Outlet } from "react-router-dom";

import { AppProviders } from "@/app/providers";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Shared chrome for every page: the app shell (sidebar + header) wraps the
 * routed feature views rendered through <Outlet />.
 */
export function RootLayout() {
  return (
    <AppProviders>
      <AppShell>
        <Outlet />
      </AppShell>
    </AppProviders>
  );
}
