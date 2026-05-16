import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSleepEntries } from './hooks/useSleepEntries';
import { useTheme } from './hooks/useTheme';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import History from './pages/History';
import Statistics from './pages/Statistics';
import { TabId } from './types';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Главная', icon: '🏠' },
  { id: 'add', label: 'Добавить', icon: '＋' },
  { id: 'history', label: 'История', icon: '📋' },
  { id: 'statistics', label: 'Статистика', icon: '📊' },
];

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const titleMap: Record<TabId, string> = {
  dashboard: 'Sleep Journal',
  add: 'Добавить запись',
  history: 'История',
  statistics: 'Статистика',
};

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-navy-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="text-lg absolute"
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="text-lg absolute"
          >
            ☀️
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { entries, addEntry, deleteEntry } = useSleepEntries();
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-navy-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🌙</span>
          <h1 className="text-lg font-semibold flex-1">{titleMap[activeTab]}</h1>
          <ThemeToggle isDark={isDark} toggle={toggle} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'dashboard' && <Dashboard entries={entries} isDark={isDark} />}
            {activeTab === 'add' && (
              <AddEntry
                onAdd={addEntry}
                onSuccess={() => setActiveTab('dashboard')}
              />
            )}
            {activeTab === 'history' && (
              <History entries={entries} onDelete={deleteEntry} />
            )}
            {activeTab === 'statistics' && <Statistics entries={entries} isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-10 bg-white/95 dark:bg-navy-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-lg mx-auto flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-lavender-500 dark:text-lavender-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <span className={`text-lg leading-none ${tab.id === 'add' ? 'font-light text-2xl' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute top-0 h-0.5 w-8 bg-lavender-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
