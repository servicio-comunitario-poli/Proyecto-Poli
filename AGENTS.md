# Proyecto Polideportivo

## Commands

- `pnpm dev` - Start dev server (http://localhost:5173)
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## Tech Stack

- React 19 + React Router 7
- Vite 8
- TailwindCSS 4 (configured via @tailwindcss/vite plugin)
- pnpm (package manager)

## Project Structure

- `src/main.jsx` - Entry point
- `src/routes/AppRouter.jsx` - Main router
- `src/Pages/` - Page components (Landing, Login, PreRegistro, PortalRegulares, InscripcionFinal, AdminPanel)
- `src/Components/` - Reusable components (Navbar, Footer)
- `src/App.css` - Global styles (not index.css which is for Tailwind)
- `src/index.css` - Tailwind imports

## Notes

- There are two AppRouter files: `src/routes/AppRouter.jsx` and `src/services/AppRouter.jsx` - verify which is used
- No TypeScript (uses plain JSX with ESLint for type checking via @types/react devDependencies)