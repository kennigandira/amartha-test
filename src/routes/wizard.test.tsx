import { render, screen, waitFor } from "@testing-library/react";
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

vi.unmock("@tanstack/react-router");

vi.mock("../components/Autocomplete/use-autocomplete-search", () => ({
  useAutocompleteSearch: (params: {
    searchQuery: string;
    endpoint: string;
    debounceMs: number;
    minQueryLength: number;
  }) => {
    if (params.endpoint.includes("departments") && params.searchQuery) {
      return {
        data: [{ id: 1, name: "Engineering" }],
        isLoading: false,
        error: null,
      };
    }
    if (params.endpoint.includes("locations") && params.searchQuery) {
      return {
        data: [
          { id: 1, name: "New York" },
          { id: 2, name: "London" },
        ],
        isLoading: false,
        error: null,
      };
    }
    return { data: [], isLoading: false, error: null };
  },
}));

vi.mock("../api/basicInfo", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/basicInfo")>();
  return {
    ...actual,
    postBasicInfo: vi.fn(() =>
      Promise.resolve({ id: 1, fullName: "John Doe" }),
    ),
    getBasicInfo: vi.fn(() => Promise.resolve([])),
  };
});

vi.mock("../api/details", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/details")>();
  return {
    ...actual,
    postDetails: vi.fn(() => Promise.resolve({ id: 1 })),
  };
});

vi.mock("../hooks/use-employees", () => ({
  useEmployees: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  })),
}));

describe("Wizard Flow", () => {
  it("should navigate through the wizard, fill out forms, and submit", async () => {
    const memoryHistory = createMemoryHistory({
      initialEntries: ["/wizard"],
    });
    const router = createRouter({
      routeTree,
      history: memoryHistory,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText("Add employee as?")).toBeInTheDocument();
    });

    await router.navigate({ to: "/wizard", search: { role: "admin" } });

    await waitFor(() => {
      expect(screen.getByText("Basic Info")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "john.doe@example.com",
    );

    await userEvent.type(
      screen.getByPlaceholderText("Search department..."),
      "Engineering",
    );
    await userEvent.click(screen.getByText("Engineering"));

    await userEvent.click(screen.getByPlaceholderText("Select an option"));
    await userEvent.click(screen.getByText("Engineer"));

    await waitFor(
      () => {
        const nextButton = screen.getByText("Next");
        expect(nextButton).not.toBeDisabled();
      },
      { timeout: 3000 },
    );

    const nextButton = screen.getByText("Next");
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await userEvent.upload(screen.getByPlaceholderText("Upload Photo"), file);

    const comboboxes = screen.getAllByRole("combobox");
    const employmentTypeSelect = comboboxes[0];
    await userEvent.click(employmentTypeSelect);
    await waitFor(() => {
      expect(screen.getByText("Full-time")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Full-time"));

    await userEvent.type(
      screen.getByPlaceholderText("Search Office Location..."),
      "New York",
    );
    await waitFor(() => {
      expect(screen.getByText("New York")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("New York"));

    await userEvent.type(
      screen.getByPlaceholderText("Notes"),
      "This is a test note.",
    );

    await waitFor(
      () => {
        const buttons = screen.getAllByRole("button");
        // Submit button is the last button in the form
        const submitButton = buttons[buttons.length - 1];
        expect(submitButton).not.toBeDisabled();
      },
      { timeout: 3000 },
    );

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons[buttons.length - 1];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Our Team")).toBeInTheDocument();
    });
  }, 10000);
});
