import { HistoryRecord } from '../src/types';

// In-memory persistent history store (Ready for Supabase PostgreSQL replacement in Phase 2)
let inMemoryHistory: HistoryRecord[] = [];

export function getHistory(): HistoryRecord[] {
  return [...inMemoryHistory].sort((a, b) => b.timestamp - a.timestamp);
}

export function saveHistoryRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'>): HistoryRecord {
  const newRecord: HistoryRecord = {
    ...record,
    id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };
  inMemoryHistory.unshift(newRecord);
  // Keep latest 50 records in memory
  if (inMemoryHistory.length > 50) {
    inMemoryHistory = inMemoryHistory.slice(0, 50);
  }
  return newRecord;
}

export function deleteHistoryRecord(id: string): boolean {
  const initialLength = inMemoryHistory.length;
  inMemoryHistory = inMemoryHistory.filter((item) => item.id !== id);
  return inMemoryHistory.length !== initialLength;
}

export function clearHistory(): void {
  inMemoryHistory = [];
}
