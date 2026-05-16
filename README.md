# Sleep Journal

Персональный трекер сна SPA, созданный с использованием React + TypeScript.

## Функции

- **Log sleep entries** — запись времени отхода ко сну, времени пробуждения, качества сна (1–10) и заметки
- **Dashboard** — сводка за сегодня с ключевыми статистическими данными
- **History** — полный список прошлых записей с возможностью редактирования и удаления
- **Statistics** — графики динамики продолжительности и качества сна с течением времени
- **Dark theme** — глубокая сине-фиолетовая палитра, спокойная и минималистичная
- **Offline-first** — все данные хранятся в localStorage, бэкенд не требуется
- **Smooth animations** — переходы между вкладками в Framer Motion

## Технологический стек

| Инструмент | Назначение |
| --- | --- |
| React + Vite | Фреймворк пользовательского интерфейса и инструмент сборки |
| TypeScript | Type safety |
| Tailwind CSS | Типобезопасность  |
| Recharts |  Графики |
| date-fns | Утилиты для работы с датами |
| Framer Motion | Анимация |
| localStorage | Сохранение данных |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Сборка

```bash
npm run build
npm run preview
```

## Структура проекта

```text
src/
├── hooks/
│   ├── useSleepEntries.ts   # data layer (localStorage CRUD)
│   └── useTheme.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── AddEntry.tsx
│   ├── History.tsx
│   └── Statistics.tsx
├── types.ts
└── App.tsx
```
