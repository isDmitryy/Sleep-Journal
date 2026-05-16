import { useState } from 'react';
import { format } from 'date-fns';
import { SleepEntry } from '../types';

interface Props {
  onAdd: (data: Omit<SleepEntry, 'id' | 'duration'>) => void;
  onSuccess: () => void;
}

const qualityEmoji = (q: number) => {
  if (q <= 2) return '😴';
  if (q <= 4) return '😕';
  if (q <= 6) return '😐';
  if (q <= 8) return '😊';
  return '🌟';
};

const inputClass =
  'w-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-lavender-500 transition-colors';

export default function AddEntry({ onAdd, onSuccess }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState({
    date: today,
    bedtime: '23:00',
    waketime: '07:00',
    quality: 7,
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleQuality(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, quality: Number(e.target.value) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      date: form.date,
      bedtime: form.bedtime,
      waketime: form.waketime,
      quality: form.quality,
      notes: form.notes.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess();
    }, 800);
  }

  return (
    <div className="pb-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Дата</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={today}
            required
            className={inputClass}
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Лёг спать</label>
            <input
              type="time"
              name="bedtime"
              value={form.bedtime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Проснулся</label>
            <input
              type="time"
              name="waketime"
              value={form.waketime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Quality slider */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-600 dark:text-slate-400">Качество сна</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{qualityEmoji(form.quality)}</span>
              <span className="text-lavender-500 dark:text-lavender-400 font-bold text-lg w-6 text-center">{form.quality}</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={form.quality}
            onChange={handleQuality}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-lavender-500"
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
            Заметки <span className="text-slate-400 dark:text-slate-600">(необязательно)</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Как прошла ночь? Что снилось?"
            className="w-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-lavender-500 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-lavender-500 hover:bg-lavender-600 disabled:bg-emerald-600 text-white font-semibold rounded-xl py-3.5 transition-colors duration-200"
        >
          {submitted ? '✓ Сохранено!' : 'Сохранить запись'}
        </button>
      </form>
    </div>
  );
}
