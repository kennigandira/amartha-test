import "@testing-library/jest-dom";
import { vi } from "vitest";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock @tanstack/react-router globally for all tests
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as Record<string, any>),
    useNavigate: vi.fn(() => vi.fn()),
    useRouter: vi.fn(() => ({
      navigate: vi.fn(),
      history: {
        back: vi.fn(),
      },
    })),
    useCanGoBack: vi.fn(() => true),
    createLink: vi.fn((Component: any) => Component),
    RouterProvider: ({ children }: { children: any }) => children,
    createRouter: vi.fn((config: any) => ({
      ...config,
      navigate: vi.fn(),
    })),
    createMemoryHistory: vi.fn(() => ({})),
  };
});
