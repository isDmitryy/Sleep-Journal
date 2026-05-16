import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { SleepEntry } from '../types';

interface Props {
  entries: SleepEntry[];
  isDark: boolean;
}

function avgTime(times: string[]): string {
  if (!times.length) return '—';
  const total = times.reduce((sum, t) => {
    const [h, m] = t.split(':').map(Number);
    let mins = h * 60 + m;
    if (mins < 12 * 60) mins += 24 * 60;
    return sum + mins;
  }, 0);
  const avg = Math.round(total / times.length) % (24 * 60);
  const h = Math.floor(avg / 60) % 24;
  const m = avg % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const PIE_COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'];
const PIE_LABELS = ['1–3', '4–5', '6–7', '8–10'];

export default function Statistics({ entries, isDark }: Props) {
  const last30 = useMemo(() => {
    const cutoff = format(subDays(new Date(), 29), 'yyyy-MM-dd');
    const inRange = entries.filter(e => e.date >= cutoff);
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const entry = inRange.find(e => e.date === dateStr);
      return {
        label: format(d, 'd MMM', { locale: ru }),
        duration: entry?.duration ?? null,
        quality: entry?.quality ?? null,
      };
    }).filter(d => d.duration !== null);
  }, [entries]);

  const avgBedtime = useMemo(() => avgTime(entries.map(e => e.bedtime)), [entries]);
  const avgWaketime = useMemo(() => avgTime(entries.map(e => e.waketime)), [entries]);

  const pieData = useMemo(() => {
    const buckets = [0, 0, 0, 0];
    entries.forEach(e => {
      if (e.quality <= 3) buckets[0]++;
      else if (e.quality <= 5) buckets[1]++;
      else if (e.quality <= 7) buckets[2]++;
      else buckets[3]++;
    });
    return PIE_LABELS.map((name, i) => ({ name, value: buckets[i] })).filter(d => d.value > 0);
  }, [entries]);

  const tooltipBg = isDark ? '#1a2340' : '#ffffff';
  const tooltipLabel = isDark ? '#cbd5e1' : '#1e293b';
  const tickFill = isDark ? '#64748b' : '#94a3b8';
  const legendColor = isDark ? '#94a3b8' : '#64748b';

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-semibold text-lavender-500 dark:text-lavender-400 mb-2">Пока нет данных</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs">
          Накопи несколько записей — и здесь появятся графики и аналитика твоего сна.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-6 space-y-6">
      {/* Avg times */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 text-center shadow-sm dark:shadow-none transition-colors">
          <p className="text-2xl font-bold text-lavender-500 dark:text-lavender-400">{avgBedtime}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Среднее время сна</p>
        </div>
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 text-center shadow-sm dark:shadow-none transition-colors">
          <p className="text-2xl font-bold text-sky-500 dark:text-sky-400">{avgWaketime}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Среднее пробуждение</p>
        </div>
      </div>

      {/* 30-day line chart */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">Последние 30 дней</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last30}>
            <XAxis
              dataKey="label"
              tick={{ fill: tickFill, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              yAxisId="dur"
              domain={[0, 12]}
              tick={{ fill: tickFill, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <YAxis
              yAxisId="qual"
              orientation="right"
              domain={[0, 10]}
              tick={{ fill: tickFill, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: tooltipLabel }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: legendColor }}
              formatter={(v) => v === 'duration' ? 'Сон (ч)' : 'Качество'}
            />
            <Line
              yAxisId="dur"
              type="monotone"
              dataKey="duration"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              yAxisId="qual"
              type="monotone"
              dataKey="quality"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quality distribution */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">Распределение качества</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[PIE_LABELS.indexOf(pieData[i].name)]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: PIE_COLORS[PIE_LABELS.indexOf(d.name)] }}
                  />
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex-1">Оценка {d.name}</span>
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
