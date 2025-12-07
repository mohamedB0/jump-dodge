# Insightful Metrics (VITALS Wellness Monitor)

A cognitive wellness assessment platform with interactive, science-inspired games, daily energy check-ins, and anonymized HR insights to track trends over time.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

- **Interactive Cognitive Games**
  - Circuit Fixer mini-game (`src/components/CircuitFixerGame.tsx`) launched from the home page (`src/pages/Index.tsx`).
  - Additional challenge cards presented on the home page (e.g., Parts Inventory, Safety Signal, Plant Simulator, Noisy Control Room) to assess processing speed, memory, attention, risk tolerance, and more.

- **Daily Energy Check-in**
  - Visual energy slider (`src/components/EnergySlider.tsx`) to capture self-reported baseline and context for performance metrics.

- **Metrics Preview**
  - Real-time metric cards (`src/components/MetricDisplay.tsx`) showing Cognitive Load, Focus Score, Stress Index, and Avg Response Time.

- **HR Dashboard Preview**
  - An anonymized, aggregated snapshot for HR/Administration on the home page illustrating team wellness, assessment activity, and burnout risk trends.

- **Modern Auth Flow**
  - Sign up and sign in screens with form validation using Zod (`src/pages/Auth.tsx`).
  - Auth context and helpers via `src/hooks/useAuth.tsx` (Supabase client configured under `src/integrations/supabase/`).

- **Polished UI/UX**
  - Reusable UI components from shadcn-ui in `src/components/ui/` with Tailwind CSS theme customizations (`tailwind.config.ts`).
  - Animated interactions powered by Framer Motion.
  - React Router for routing (`/`, `/auth`, catch-all 404).
  - React Query for data management and caching.
  - Toast notifications via `src/hooks/use-toast.ts` and `@/components/ui/toaster`.

- **Performance and DX**
  - Vite + SWC for fast dev and builds.
  - TypeScript-first with strict typing.
#
