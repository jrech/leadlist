/**
 * Core types for the AI Orchestration Layer.
 * Defines the structure of jobs, results, statuses, and generation types.
 */

/**
 * Represents the type of AI generation task.
 */
export type GenerationType = 'audit' | 'mockup' | 'email';

/**
 * Represents the current lifecycle state of a generation job.
 */
export type GenerationStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Result returned from a successful AI generation.
 */
export interface GenerationResult {
  /** The generated content (text, HTML, JSON, etc.) */
  content: string;
  /** Optional token usage metrics */
  tokensUsed?: number;
  /** The model identifier used for generation */
  model?: string;
  /** Timestamp of generation completion */
  timestamp: Date;
}

/**
 * Represents a pending or active AI generation request.
 * Managed by AIService and passed to providers.
 */
export interface GenerationJob {
  /** Unique identifier for the job */
  id: string;
  /** Type of generation requested */
  type: GenerationType;
  /** Current lifecycle status */
  status: GenerationStatus;
  /** Name of the provider handling this job */
  provider: string;
  /** Input data payload for the provider */
  input: Record<string, unknown>;
  /** Result data (populated on completion) */
  result?: GenerationResult;
  /** Error details (populated on failure) */
  error?: Error;
  /** Job creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Progress percentage (0-100) */
  progress: number;
  /** Optional callback for progress updates */
  onProgress?: (progress: number) => void;
  /** Optional callback for cancellation requests */
  onCancel?: () => void;
}