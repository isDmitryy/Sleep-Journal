# Sleep Journal

A personal sleep tracker SPA built with React + TypeScript.

## Features

- **Log sleep entries** — record bedtime, wake time, sleep quality (1–10) and notes
- **Dashboard** — today's summary with key stats at a glance
- **History** — full list of past entries with edit and delete
- **Statistics** — charts for sleep duration trends and quality over time
- **Dark theme** — deep blue/purple palette, calm and minimalist
- **Offline-first** — all data stored in localStorage, no backend required
- **Smooth animations** — Framer Motion transitions between tabs

## Tech Stack

| Tool | Purpose |
| --- | --- |
| React + Vite | UI framework & build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Charts |
| date-fns | Date utilities |
| Framer Motion | Animations |
| localStorage | Data persistence |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

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
