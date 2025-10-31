# Amartha Test - Employee Management Wizard

A modern employee management application built with React, TypeScript, and Vite. Features a multi-step wizard for adding employees with draft persistence and a team dashboard.

## Features

- Multi-step employee wizard with form validation
- Real-time draft persistence using localStorage
- Team member dashboard with photo display
- File upload for employee photos
- Responsive design with Tailwind CSS v4
- Type-safe routing with TanStack Router
- Dark mode support with next-themes

## Tech Stack

- **Frontend Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Routing:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4.1.16
- **Icons:** Lucide React, React Icons
- **Code Quality:** ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** v14 or higher (recommended: v18+)
- **npm:** v7+ (comes with Node.js) or **pnpm**

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd amartha-test
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Or if you're using pnpm:

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (default Vite port)

## Available Scripts

| Script            | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite development server with hot module replacement (HMR) |
| `npm run build`   | Creates an optimized production build in the `/dist` folder          |
| `npm run lint`    | Runs ESLint to check for code quality issues                         |
| `npm run preview` | Previews the production build locally                                |

## Development Guide

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of: import Button from '../../../components/Button'
import Button from "@/components/Button";
```

The `@` symbol maps to the `/src` directory.

### Routing

This project uses **TanStack Router** with file-based routing:

- Routes are defined in the `src/routes/` directory
- `__root.tsx` is the root layout component
- Each file in `routes/` automatically becomes a route
- The route tree is auto-generated in `routeTree.gen.ts`

**Available Routes:**

- `/` - Home page (team listing)
- `/wizard` - Employee wizard

### Styling

The project uses **Tailwind CSS v4** with the Vite plugin:

- Utility-first CSS framework
- Dark mode support via `next-themes`
- Component variants managed with `class-variance-authority`
- Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes

Example:

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', condition && 'conditional-class')} />
```

## Configuration Files

### vite.config.js

- Configures TanStack Router plugin with auto code-splitting
- Sets up path aliases (`@` → `/src`)
- Integrates Tailwind CSS Vite plugin

### tsconfig.json

- TypeScript compiler options
- Path aliases configuration
- Module resolution strategy

### eslint.config.js

- React-specific linting rules
- React Hooks rules
- Custom rules for unused variables

### .prettierrc

- Code formatting configuration (uses Prettier defaults)

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `/dist` directory. To preview the production build locally:

```bash
npm run preview
```

## Code Quality

The project includes:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run linting before committing:

```bash
npm run lint
```

## Contributing

1. Follow the existing code style and formatting
2. Run `npm run lint` before committing
3. Ensure TypeScript types are properly defined
4. Test your changes in both light and dark modes

## License

[Add your license information here]
