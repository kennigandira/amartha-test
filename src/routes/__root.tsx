import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="relative h-screen flex items-center justify-center bg-zinc-100">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
