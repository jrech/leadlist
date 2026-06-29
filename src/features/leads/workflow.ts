import {
  ImageIcon,
  Mail,
  Plus,
  Reply,
  ScanSearch,
  Search,
  Send,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type { WorkflowStep } from "@/components/common/WorkflowStepper";
import type { LeadStatus } from "@/types/lead";

interface WorkflowStage extends WorkflowStep {
  id: LeadStatus;
  icon: LucideIcon;
}

/**
 * The end-to-end pipeline, as the lead's own `LeadStatus` values. Each step is
 * a status, so the stepper's `currentStepId` is simply `lead.status` and
 * moving the workflow is just a status change — no separate stage vocabulary
 * to keep in sync. `lost` is intentionally absent: it's a terminal off-ramp,
 * not a forward stage.
 */
export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: "new", label: "New", icon: Plus },
  { id: "research", label: "Research", icon: Search },
  { id: "audit_ready", label: "Audit", icon: ScanSearch },
  { id: "mockup_ready", label: "Mockup", icon: ImageIcon },
  { id: "email_ready", label: "Email", icon: Mail },
  { id: "contacted", label: "Contacted", icon: Send },
  { id: "follow_up", label: "Follow-up", icon: Reply },
  { id: "won", label: "Won", icon: Trophy },
];

/** Pipeline order, for comparing how far along two statuses are. */
export const STAGE_ORDER: LeadStatus[] = WORKFLOW_STAGES.map((s) => s.id);

/** Position of a status in the pipeline; unknown/`lost` clamps to the start. */
export function stageIndex(status: LeadStatus): number {
  const i = STAGE_ORDER.indexOf(status);
  return i === -1 ? 0 : i;
}

/** A completed workspace action that should push the workflow forward. */
export type WorkflowAction = "research" | "audit" | "mockup" | "email" | "sent";

/** The stage each action implies is now complete. */
const ACTION_TARGET: Record<WorkflowAction, LeadStatus> = {
  research: "research",
  audit: "audit_ready",
  mockup: "mockup_ready",
  email: "email_ready",
  sent: "contacted",
};

/**
 * The status to advance to when `action` completes, or `null` if the lead is
 * already at or past that stage. Only ever moves forward — completing an
 * earlier action never drags a further-along lead backward.
 */
export function advancedStatus(
  current: LeadStatus,
  action: WorkflowAction,
): LeadStatus | null {
  const target = ACTION_TARGET[action];
  return stageIndex(target) > stageIndex(current) ? target : null;
}
