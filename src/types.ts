export interface SleepEntry {
  id: string;
  date: string;      // "YYYY-MM-DD"
  bedtime: string;   // "HH:mm"
  waketime: string;  // "HH:mm"
  duration: number;  // hours
  quality: number;   // 1–10
  notes: string;
}

export type TabId = 'dashboard' | 'add' | 'history' | 'statistics';
