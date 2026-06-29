import { Clock, StickyNote } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { ROUTES } from "@/app/routes";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { GenerationErrorState } from "@/components/common/GenerationErrorState";
import { SectionCard } from "@/components/common/SectionCard";
import { WorkflowStepper } from "@/components/common/WorkflowStepper";
import { AuditCard } from "@/features/leads/detail/cards/AuditCard";
import { EmailCard } from "@/features/leads/detail/cards/EmailCard";
import { MockupCard } from "@/features/leads/detail/cards/MockupCard";
import { ResearchCard } from "@/features/leads/detail/cards/ResearchCard";
import { LeadDetailHeader } from "@/features/leads/detail/LeadDetailHeader";
import { LeadDetailSidebar } from "@/features/leads/detail/LeadDetailSidebar";
import { NotesTimeline } from "@/features/leads/detail/NotesTimeline";
import { TimelineList } from "@/features/leads/detail/TimelineList";
import { useLeadGenerations } from "@/features/leads/detail/useLeadGenerations";
import { useLeadTimeline } from "@/features/leads/detail/useLeadTimeline";
import { STATUS_META } from "@/features/leads/lead-meta";
import { useLead } from "@/features/leads/useLead";
import {
  advancedStatus,
  stageIndex,
  WORKFLOW_STAGES,
  type WorkflowAction,
} from "@/features/leads/workflow";
import type { Lead, LeadStatus } from "@/types/lead";

/** Inert placeholder so hooks always have a valid Lead shape while loading. */
const EMPTY_LEAD: Lead = {
  id: "",
  company: "",
  website: "",
  industry: "generic",
  country: "czech_republic",
  status: "new",
  priority: "low",
};

/**
 * Lead Workspace — the screen this app is built around. Everything for a lead
 * happens here: workflow progress (which auto-advances as the AI modules run,
 * and can be walked back with a confirmation), the four AI modules
 * (Research → Audit → Mockup → Email), assignment, an activity timeline, and a
 * notes feed. All of it persists to Notion.
 */
export function LeadDetailPage() {
  const { leadId } = useParams();
  const {
    lead,
    loading: leadLoading,
    error: leadError,
    retry: retryLead,
    updateLead,
    archiveLead,
  } = useLead(leadId);

  // Hooks must run unconditionally, so they get a safe fallback while the
  // lead is loading or missing; we branch on it only in the render below.
  const timeline = useLeadTimeline(lead?.id ?? "");
  const generations = useLeadGenerations(lead ?? EMPTY_LEAD, timeline.addEvent);

  // Pending reverse/forward workflow move, awaiting confirmation.
  const [pendingStage, setPendingStage] = useState<LeadStatus | null>(null);
  const [movingStage, setMovingStage] = useState(false);

  const sentEvent = timeline.events.find((e) => e.type === "email_sent");
  const sentAt = sentEvent?.occurredAt ?? null;

  /** Moves the lead's status forward to `next`, recording it on the timeline. */
  const moveTo = async (from: LeadStatus, next: LeadStatus) => {
    await updateLead({ status: next });
    await timeline.addEvent({
      leadId: lead!.id,
      type: "status_changed",
      from,
      to: next,
      message: `Workflow moved to ${STATUS_META[next].label}`,
      occurredAt: new Date().toISOString(),
    });
  };

  /** Auto-advance after an action completes — only ever forward (see workflow.ts). */
  const advance = async (action: WorkflowAction) => {
    if (!lead) return;
    const next = advancedStatus(lead.status, action);
    if (!next) return;
    // A failed status bump shouldn't mask a successful generation; the error
    // still surfaces via useLead's error banner.
    await moveTo(lead.status, next).catch(() => {});
  };

  const withAdvance =
    <T,>(action: WorkflowAction, generate: () => Promise<T>) =>
    async () => {
      const result = await generate();
      await advance(action);
      return result;
    };

  const handleMarkSent = async () => {
    if (!lead || !generations.email) return;
    await advance("sent");
    await timeline.addEvent({
      leadId: lead.id,
      type: "email_sent",
      message: "Outreach email sent",
      occurredAt: new Date().toISOString(),
      generationId: generations.email.id,
    });
  };

  const handleAssign = async (assignee: string | null) => {
    if (!lead) return;
    // "" clears the Notion select; undefined would leave it unchanged.
    await updateLead({ assignee: assignee ?? "" });
    await timeline.addEvent({
      leadId: lead.id,
      type: "assigned",
      assignee,
      message: assignee ? `Assigned to ${assignee}` : "Unassigned",
      occurredAt: new Date().toISOString(),
    });
  };

  const confirmMove = async () => {
    if (!lead || !pendingStage) return;
    setMovingStage(true);
    try {
      await moveTo(lead.status, pendingStage);
      setPendingStage(null);
    } finally {
      setMovingStage(false);
    }
  };

  if (leadLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  // A real sync error (not just "no such lead") gets its own retry-able
  // state instead of silently bouncing to the leads list.
  if (!lead && leadError) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-6">
        <GenerationErrorState error={leadError} onRetry={retryLead} />
      </div>
    );
  }

  if (!lead) {
    return <Navigate to={ROUTES.leads} replace />;
  }

  const movingBack =
    pendingStage !== null && stageIndex(pendingStage) < stageIndex(lead.status);

  return (
    <div>
      <LeadDetailHeader
        lead={lead}
        onArchive={archiveLead}
        onLogActivity={timeline.addEvent}
        onAssign={handleAssign}
      />

      <div className="mx-auto grid w-full max-w-6xl animate-fade-in grid-cols-1 gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_320px]">
        {/* Main workspace */}
        <div className="flex flex-col gap-6">
          {leadError && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
              {leadError}
            </p>
          )}

          <SectionCard
            title="Progress"
            description="Click a step to move the lead forward or back"
          >
            <WorkflowStepper
              steps={WORKFLOW_STAGES}
              currentStepId={lead.status}
              onStepClick={(id) => setPendingStage(id as LeadStatus)}
            />
          </SectionCard>

          <ResearchCard
            leadId={lead.id}
            generation={generations.research}
            onGenerate={withAdvance("research", generations.generateResearch)}
            onSave={(output) => generations.updateGeneration("research", { output })}
          />

          <AuditCard
            leadId={lead.id}
            generation={generations.audit}
            onGenerate={withAdvance("audit", generations.generateAudit)}
            onSave={(output) => generations.updateGeneration("audit", { output })}
          />

          <MockupCard
            leadId={lead.id}
            generation={generations.mockup}
            onGenerate={withAdvance("mockup", generations.generateMockup)}
            onLogActivity={timeline.addEvent}
          />

          <EmailCard
            leadId={lead.id}
            generation={generations.email}
            onGenerate={withAdvance("email", generations.generateEmail)}
            onSave={(variants) => generations.updateGeneration("email", { variants })}
            sentAt={sentAt}
            onMarkSent={handleMarkSent}
          />

          <SectionCard title="Timeline" description="Activity history" icon={Clock}>
            <TimelineList events={timeline.events} loading={timeline.loading} />
          </SectionCard>

          <SectionCard title="Notes" icon={StickyNote}>
            <NotesTimeline
              leadId={lead.id}
              defaultAuthor={lead.assignee ?? ""}
              onLogged={timeline.addEvent}
            />
          </SectionCard>
        </div>

        {/* Right rail */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <LeadDetailSidebar lead={lead} />
        </aside>
      </div>

      <ConfirmDialog
        open={pendingStage !== null}
        title={
          pendingStage
            ? `${movingBack ? "Return" : "Move"} this lead to "${STATUS_META[pendingStage].label}"?`
            : ""
        }
        description="This will not delete any generated content."
        confirmLabel={movingBack ? "Return" : "Move"}
        onConfirm={confirmMove}
        onCancel={() => setPendingStage(null)}
        loading={movingStage}
      />
    </div>
  );
}
