# Employee Management Wizard

A modern employee management application built with React, TypeScript, and Vite. Features a multi-step wizard for adding employees with draft persistence and a team dashboard.

## Brainstorming Whiteboard
[<img width="1442" height="1026" alt="image" src="https://github.com/user-attachments/assets/6901a111-1d2d-42ea-9b8c-0b7a8dc865fe" />](https://excalidraw.com/#json=Th1bTF5s2LCN5ffryICCs,E9gj-3V1LUV1cTBMcI1Bhg)


## Features

- **Multi-step employee wizard** with form validation across Admin and Ops workflows
- **Real-time draft persistence** using localStorage to prevent data loss
- **Team member dashboard** with pagination and employee photo display
- **Type-safe routing** with TanStack Router
- **Docker support** for seamless development and deployment

## Tech Stack

- **Frontend Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Routing:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4.1.16
- **Icons:** Lucide React
- **Code Quality:** ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** v20
- **npm:** v7+ (comes with Node.js) or **pnpm**
- **Docker & Docker Compose** (optional, for containerized development)

## Setup & Installation

### Local Development (Without Docker)

1. **Clone the repository**

   ```bash
   git clone https://github.com/kennigandira/amartha-test.git
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

3. **Configure environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your API endpoints (if using local JSON servers):

   ```
   VITE_BASIC_INFO_SERVICE_PORT=http://localhost:4001
   VITE_DETAILS_SERVICE_PORT=http://localhost:4002
   ```

4. **Start the development server with JSON servers**

   The simplest way to get started is to run everything at once:

   ```bash
   npm run dev:full
   ```

   This starts:
   - Vite dev server on port 5173
   - JSON server for basic info on port 4001
   - JSON server for employee details on port 4002

   The application will be available at `http://localhost:5173`

   **Alternative setups (if you prefer):**

   **Option A: Run servers and dev separately in different terminals**

   Terminal 1 - Run both JSON servers:

   ```bash
   npm run servers
   ```

   Terminal 2 - Run dev server:

   ```bash
   npm run dev
   ```

   **Option B: Run each server individually**

   Terminal 1:

   ```bash
   npm run server:step1
   ```

   Terminal 2:

   ```bash
   npm run server:step2
   ```

   Terminal 3:

   ```bash
   npm run dev
   ```

   **Option C: Manual commands**

   Terminal 1 - Basic Info Service:

   ```bash
   npx json-server@0.17.4 --host 0.0.0.0 --port 4001 --watch db_step1.json
   ```

   Terminal 2 - Employee Details Service:

   ```bash
   npx json-server@0.17.4 --host 0.0.0.0 --port 4002 --watch db_step2.json
   ```

   Terminal 3 - Dev Server:

   ```bash
   npm run dev
   ```

### Docker Setup

The project includes Docker and Docker Compose configuration for containerized development:

**Docker Configuration:**

- **Dockerfile:** Uses Node 20 Alpine for a lightweight image, runs Vite dev server on port 3000
- **docker-compose.yml:** Orchestrates three services:
  - `webapp` - React application (port 3000)
  - `db-step1` - JSON Server for basic employee info (port 4001)
  - `db-step2` - JSON Server for employee details (port 4002)

**Start all services with Docker Compose:**

```bash
docker-compose up
```

The application will be available at `http://localhost:3000`, with API services running on ports 4001 and 4002.

**Stop services:**

```bash
docker-compose down
```

## Development & Build

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `/dist` folder.

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build.

## Available Scripts

| Script                 | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server with hot module replacement (HMR) |
| `npm run build`        | Creates an optimized production build in the `/dist` folder          |
| `npm run lint`         | Runs ESLint to check for code quality issues                         |
| `npm run preview`      | Previews the production build locally                                |
| `npm test`             | Runs unit tests in watch mode                                        |
| `npm run test:watch`   | Runs unit tests in interactive watch mode                            |
| `npm run server:step1` | Starts JSON server for basic info on port 4001                       |
| `npm run server:step2` | Starts JSON server for employee details on port 4002                 |
| `npm run servers`      | Starts both JSON servers concurrently                                |
| `npm run dev:full`     | Starts dev server and both JSON servers concurrently                 |

## Project Structure

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

- `/` - Home page (team listing with pagination)
- `/wizard` - Employee wizard (multi-step form)

### Styling

The project uses **Tailwind CSS v4** with the Vite plugin:

- Utility-first CSS framework
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

## Code Quality

The project includes:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run linting before committing:

```bash
npm run lint
```

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `/dist` directory. To preview the production build locally:

```bash
npm run preview
```

## Contributing

1. Follow the existing code style and formatting
2. Run `npm run lint` before committing
3. Ensure TypeScript types are properly defined
4. Test your changes in both light and dark modes
