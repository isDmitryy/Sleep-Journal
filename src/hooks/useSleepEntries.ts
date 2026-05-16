import { useState, useEffect } from 'react';
import { SleepEntry } from '../types';

const STORAGE_KEY = 'sleep-journal-entries';

function calcDuration(bedtime: string, waketime: string): number {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = waketime.split(':').map(Number);
  let minutes = (wh * 60 + wm) - (bh * 60 + bm);
  if (minutes <= 0) minutes += 24 * 60;
  return Math.round((minutes / 60) * 100) / 100;
}

function load(): SleepEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SleepEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: SleepEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useSleepEntries() {
  const [entries, setEntries] = useState<SleepEntry[]>(load);

  useEffect(() => {
    save(entries);
  }, [entries]);

  function addEntry(data: Omit<SleepEntry, 'id' | 'duration'>) {
    const entry: SleepEntry = {
      ...data,
      id: crypto.randomUUID(),
      duration: calcDuration(data.bedtime, data.waketime),
    };
    setEntries(prev => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  return { entries, addEntry, deleteEntry };
}
