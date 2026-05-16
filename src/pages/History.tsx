import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { SleepEntry } from '../types';

interface Props {
  entries: SleepEntry[];
  onDelete: (id: string) => void;
}

function qualityBadgeClass(q: number): string {
  if (q >= 8) return 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300';
  if (q >= 5) return 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-lavender-400';
  return 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300';
}

export default function History({ entries, onDelete }: Props) {
  const months = useMemo(() => {
    const set = new Set(entries.map(e => e.date.slice(0, 7)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (selectedMonth === 'all') return entries;
    return entries.filter(e => e.date.startsWith(selectedMonth));
  }, [entries, selectedMonth]);

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-semibold text-lavender-500 dark:text-lavender-400 mb-2">История пуста</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
          Твои записи о сне появятся здесь. Начни добавлять их уже сегодня!
        </p>
      </div>
    );
  }

  return (
    <div className="pb-6 space-y-4">
      {/* Month filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSelectedMonth('all')}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedMonth === 'all'
              ? 'bg-lavender-500 text-white'
              : 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Все
        </button>
        {months.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedMonth === m
                ? 'bg-lavender-500 text-white'
                : 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {format(parseISO(m + '-01'), 'LLL yyyy', { locale: ru })}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-800 dark:text-slate-200 font-medium capitalize">
                    {format(parseISO(entry.date), 'EEEE, d MMMM', { locale: ru })}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qualityBadgeClass(entry.quality)}`}>
                    {entry.quality}/10
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span>🌙 {entry.bedtime}</span>
                  <span>☀️ {entry.waketime}</span>
                  <span className="text-sky-500 dark:text-sky-400 font-medium">{entry.duration}ч</span>
                </div>
                {entry.notes && (
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 leading-relaxed">{entry.notes}</p>
                )}
              </div>

              {confirmId === entry.id ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { onDelete(entry.id); setConfirmId(null); }}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(entry.id)}
                  className="flex-shrink-0 text-slate-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 transition-colors p-1"
                  aria-label="Удалить"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
