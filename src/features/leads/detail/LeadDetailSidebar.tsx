import { ArrowUpRight, Globe, Mail, Phone, User } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { nextActionForStatus } from "@/features/leads/lead-meta";
import { relativeTime } from "@/lib/relativeTime";
import type { Lead } from "@/types/lead";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium text-foreground">
        {children}
      </span>
    </div>
  );
}

/** Right rail: compact information only — contact, then lead metadata. */
export function LeadDetailSidebar({ lead }: { lead: Lead }) {
  const { contact } = lead;

  return (
    <div className="flex flex-col gap-4">
      {/* Contact */}
      <SectionCard title="Contact" icon={User}>
        {contact?.name || contact?.email || contact?.phone ? (
          <dl className="flex flex-col gap-3 text-sm">
            {contact.name && (
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd className="mt-0.5 font-medium">{contact.name}</dd>
              </div>
            )}
            {contact.phone && (
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="mt-0.5">
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {contact.phone}
                  </a>
                </dd>
              </div>
            )}
            {contact.email && (
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="mt-0.5">
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
                  >
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {contact.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted-foreground">Website</dt>
              <dd className="mt-0.5">
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
                >
                  <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {lead.website}
                </a>
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-xs text-muted-foreground">No contact on file.</p>
        )}
      </SectionCard>

      {/* Details */}
      <SectionCard title="Details">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
              strokeWidth={2}
            />
            <span className="text-sm font-medium">
              {nextActionForStatus(lead.status)}
            </span>
          </div>

          <InfoRow label="Last activity">
            {lead.lastActivityAt ? relativeTime(lead.lastActivityAt) : "—"}
          </InfoRow>
          <InfoRow label="Follow-up">
            {lead.followUpAt ? relativeTime(lead.followUpAt) : "—"}
          </InfoRow>
          <InfoRow label="Created">
            {lead.createdAt ? relativeTime(lead.createdAt) : "—"}
          </InfoRow>
          <InfoRow label="Modified">
            {lead.updatedAt ? relativeTime(lead.updatedAt) : "—"}
          </InfoRow>
        </div>
      </SectionCard>
    </div>
  );
}
