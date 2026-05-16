import { useMemo } from 'react';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SleepEntry } from '../types';

interface Props {
  entries: SleepEntry[];
  isDark: boolean;
}

function qualityColor(q: number): string {
  if (q >= 8) return '#60a5fa';
  if (q >= 5) return '#a78bfa';
  return '#f472b6';
}

function calcStreak(entries: SleepEntry[]): number {
  if (!entries.length) return 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const e of sorted) {
    const d = parseISO(e.date);
    const diff = differenceInDays(current, d);
    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return streak;
}

export default function Dashboard({ entries, isDark }: Props) {
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      return {
        label: format(d, 'EEE', { locale: ru }),
        duration: entry?.duration ?? 0,
        quality: entry?.quality ?? 0,
      };
    });
  }, [entries]);

  const last7entries = useMemo(() => {
    const cutoff = format(subDays(new Date(), 6), 'yyyy-MM-dd');
    return entries.filter(e => e.date >= cutoff);
  }, [entries]);

  const avgDuration = last7entries.length
    ? last7entries.reduce((s, e) => s + e.duration, 0) / last7entries.length
    : 0;

  const avgQuality = last7entries.length
    ? last7entries.reduce((s, e) => s + e.quality, 0) / last7entries.length
    : 0;

  const streak = useMemo(() => calcStreak(entries), [entries]);
  const latest = entries[0];

  const tooltipBg = isDark ? '#1a2340' : '#ffffff';
  const tooltipLabel = isDark ? '#cbd5e1' : '#1e293b';
  const tickFill = isDark ? '#94a3b8' : '#94a3b8';
  const emptyBar = isDark ? '#1e2d4a' : '#e2e8f0';

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-6xl mb-4">🌙</div>
        <h2 className="text-2xl font-semibold text-lavender-500 dark:text-lavender-400 mb-2">Начни отслеживать сон</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
          Добавь первую запись — и здесь появится твоя статистика и графики.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 flex flex-col items-center shadow-sm dark:shadow-none transition-colors">
          <span className="text-2xl font-bold text-sky-500 dark:text-sky-400">{avgDuration.toFixed(1)}ч</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Средний сон</span>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 flex flex-col items-center shadow-sm dark:shadow-none transition-colors">
          <span className="text-2xl font-bold text-lavender-500 dark:text-lavender-400">{avgQuality.toFixed(1)}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Качество</span>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 flex flex-col items-center shadow-sm dark:shadow-none transition-colors">
          <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{streak}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Streak дней</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">Последние 7 дней</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={last7} barSize={24}>
            <XAxis
              dataKey="label"
              tick={{ fill: tickFill, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 12]} />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: tooltipLabel }}
              formatter={(v: number) => [`${v}ч`, 'Сон']}
            />
            <Bar dataKey="duration" radius={[6, 6, 0, 0]}>
              {last7.map((d, i) => (
                <Cell key={i} fill={d.quality ? qualityColor(d.quality) : emptyBar} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center text-xs text-slate-400 dark:text-slate-500">
          <span><span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1" />≥ 8</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-lavender-400 mr-1" />5–7</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-1" />≤ 4</span>
        </div>
      </div>

      {/* Latest entry */}
      {latest && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Последняя запись</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-medium capitalize">
                {format(parseISO(latest.date), 'd MMMM', { locale: ru })}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                {latest.bedtime} → {latest.waketime}
              </p>
              {latest.notes && (
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 truncate max-w-[200px]">{latest.notes}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sky-500 dark:text-sky-400 text-xl font-bold">{latest.duration}ч</p>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <span className="text-xs text-slate-500 dark:text-slate-400">качество</span>
                <span className="text-lavender-500 dark:text-lavender-400 font-semibold">{latest.quality}/10</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
