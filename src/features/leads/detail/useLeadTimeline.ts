import { useCallback, useEffect, useState } from "react";

import { dataSource } from "@/data/repositories";
import type { NewTimelineEvent } from "@/data/repositories/types";
import type { TimelineEvent } from "@/types/timeline";

/**
 * Loads a lead's activity history (Notion-backed) and exposes `addEvent` for
 * appending entries optimistically. Every workspace action — generations,
 * workflow moves, assignment, notes, status changes — funnels through
 * `addEvent`, so the timeline is the one place those are recorded.
 */
export function useLeadTimeline(leadId: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    dataSource.timeline.listByLead(leadId).then((data) => {
      if (active) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [leadId]);

  const addEvent = useCallback(async (input: NewTimelineEvent) => {
    const event = await dataSource.timeline.add(input);
    setEvents((prev) => [event, ...prev]);
    return event;
  }, []);

  return { events, loading, addEvent };
}
