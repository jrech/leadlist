import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "@/app/RootLayout";
import { ROUTES } from "@/app/routes";
import { AuditPage } from "@/features/audit/AuditPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { EmailPage } from "@/features/email/EmailPage";
import { LeadsPage } from "@/features/leads/LeadsPage";
import { LeadDetailPage } from "@/features/leads/detail/LeadDetailPage";
import { MockupPage } from "@/features/mockup/MockupPage";

/**
 * The Dashboard is the default landing page; the workflow tools are sibling
 * routes under the shared layout. Add new top-level destinations here.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.leads, element: <LeadsPage /> },
      { path: ROUTES.leadDetail, element: <LeadDetailPage /> },
      { path: ROUTES.audit, element: <AuditPage /> },
      { path: ROUTES.email, element: <EmailPage /> },
      { path: ROUTES.mockup, element: <MockupPage /> },
      { path: "*", element: <Navigate to={ROUTES.dashboard} replace /> },
    ],
  },
]);
