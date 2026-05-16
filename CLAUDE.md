# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Всегда отвечай на русском.

## Project

**Sleep Journal** — a personal sleep tracker SPA. Spec is in [SPEC.md](SPEC.md).

## Tech Stack

- React + Vite (TypeScript)
- Tailwind CSS
- Recharts (charts)
- date-fns (date utilities)
- Framer Motion (animations)
- localStorage (persistence — no backend)

## Commands

```bash
npm create vite@latest . -- --template react-ts   # one-time setup
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## Architecture

Single-page app with tab-based routing (no React Router — active tab managed in top-level state).

**Pages**: Dashboard · AddEntry · History · Statistics

**Data layer**: all reads/writes go through a single `useSleepEntries` hook that wraps localStorage. Components never access localStorage directly.

**Entry shape**:
```ts
interface SleepEntry {
  id: string;
  date: string;       // ISO date "YYYY-MM-DD"
  bedtime: string;    // "HH:mm"
  waketime: string;   // "HH:mm"
  duration: number;   // hours, auto-calculated (handles midnight crossover)
  quality: number;    // 1–10
  notes: string;
}
```

## Design

Dark theme: deep dark blue/purple background, soft blue and lavender accents. Minimalist, calm, mobile-first. Smooth Framer Motion transitions between tabs. Empty states with motivational text when no entries exist.
