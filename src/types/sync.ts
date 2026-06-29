/**
 * Metadata shared by every persistable entity. Optional today (the mock
 * data source doesn't populate it) and filled in once a real backend such
 * as Notion is connected — so entity shapes don't change when that happens.
 */
export interface SyncMetadata {
  /** ISO 8601 timestamp of creation. */
  createdAt?: string;
  /** ISO 8601 timestamp of last update. */
  updatedAt?: string;
  /**
   * Identifier in the external system (e.g. a Notion page id). Lets a local
   * record be matched back to its remote counterpart for two-way sync.
   */
  externalId?: string;
}
