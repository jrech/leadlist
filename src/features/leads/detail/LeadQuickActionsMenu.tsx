import { Archive, Check, Copy, MoreHorizontal, PlusSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { leadDetailPath } from "@/app/routes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { leadService } from "@/data/leadService";
import type { NewTimelineEvent } from "@/data/repositories/types";
import type { Lead } from "@/types/lead";

interface LeadQuickActionsMenuProps {
  lead: Lead;
  onArchive: () => Promise<unknown>;
  onLogActivity: (event: NewTimelineEvent) => Promise<unknown>;
}

/**
 * Header-level admin actions — deliberately small. The AI workflow actions
 * already live, always visible, on their own cards; this menu only holds
 * things that don't have a natural home elsewhere, and every item here
 * actually does something (no disabled placeholders). Every action goes
 * through `leadService` — never a backend directly.
 */
export function LeadQuickActionsMenu({
  lead,
  onArchive,
  onLogActivity,
}: LeadQuickActionsMenuProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const duplicate = async () => {
    const { id, createdAt, updatedAt, externalId, ...rest } = lead;
    const created = await leadService.createLead({
      ...rest,
      company: `${lead.company} (copy)`,
      status: "new",
    });
    navigate(leadDetailPath(created.id));
  };

  const archive = async () => {
    if (lead.status === "lost") return;
    const from = lead.status;
    await onArchive();
    await onLogActivity({
      leadId: lead.id,
      type: "status_changed",
      message: "Lead archived",
      occurredAt: new Date().toISOString(),
      from,
      to: "lost",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Quick actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          {copied ? <Check className="text-success" /> : <Copy />}
          {copied ? "Link copied" : "Copy lead link"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={duplicate}>
          <PlusSquare />
          Duplicate lead
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={archive}
          disabled={lead.status === "lost"}
          className="text-amber-300 focus:bg-amber-400/10"
        >
          <Archive />
          Archive lead
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
