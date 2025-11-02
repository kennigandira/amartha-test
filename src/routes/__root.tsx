import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="relative flex items-center justify-center bg-zinc-100 min-h-screen">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
