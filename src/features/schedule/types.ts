export interface ConflictEntry {
  date: string;
  isAvailable: boolean;
  note: string | null;
}

export interface BulkPreviewResult {
  error?: string;
  conflicts?: ConflictEntry[];
  totalDates?: number;
}

export interface BulkApplyResult {
  error?: string;
  success?: string;
  count?: number;
}
