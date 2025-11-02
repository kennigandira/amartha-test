
import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createRouter, createMemoryHistory } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock the API endpoints
vi.mock("../components/Autocomplete/use-autocomplete-search", () => ({
  useAutocompleteSearch: (endpoint: string) => {
    if (typeof endpoint === 'string' && endpoint.includes("departments")) {
      return {
        data: [
          { id: 1, name: "Engineering" },
        ],
        loading: false,
      };
    }
    if (typeof endpoint === 'string' && endpoint.includes("locations")) {
      return {
        data: [
          { id: 1, name: "New York" },
          { id: 2, name: "London" },
        ],
        loading: false,
      };
    }
    return { data: [], loading: false };
  },
}));

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/wizard"] }),
});

describe("Wizard Flow", () => {
  it("should navigate through the wizard, fill out forms, and submit", async () => {
    render(<RouterProvider router={router} />);

    // 1. Initial render shows WizardIntro
    await waitFor(() => {
      expect(screen.getByText("Add employee as?")).toBeInTheDocument();
    });

    // 2. Navigate to Step 1
    router.navigate({ to: "/wizard", search: { role: "admin" } });

    // 3. Fill out Step1Form
    await waitFor(() => {
      expect(screen.getByText("Basic Info")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await userEvent.type(screen.getByPlaceholderText("Email"), "john.doe@example.com");

    // Simulate department selection
    await userEvent.type(screen.getByPlaceholderText("Search department..."), "Engineering");
    await userEvent.click(screen.getByText("Engineering"));

    // Simulate role selection
    await userEvent.click(screen.getByPlaceholderText("Select an option"));
    await userEvent.click(screen.getByText("Engineer"));


    // 4. Click Next
    await waitFor(() => {
      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();
      userEvent.click(nextButton);
    }, { timeout: 2000 });

    // 5. Assert navigation to Step 2
    await waitFor(() => {
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    // 6. Fill out Step2Form
    // Simulate photo upload
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await userEvent.upload(screen.getByPlaceholderText("Upload Photo"), file);

    // Simulate employment type selection
    await userEvent.click(screen.getAllByText("Select an option")[0]);
    await userEvent.click(screen.getByText("Full-time"));

    // Simulate office location selection
    await userEvent.type(screen.getByPlaceholderText("Search Office Location..."), "New York");
    await userEvent.click(screen.getByText("New York"));

    await userEvent.type(screen.getByPlaceholderText("Notes"), "This is a test note.");

    // 7. Click Submit
    const submitButton = screen.getByText("Submit");
    expect(submitButton).not.toBeDisabled();

    const consoleSpy = vi.spyOn(console, "log");
    await userEvent.click(submitButton);

    // 8. Assert submission
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Form submitted:",
        expect.any(Object)
      );
    });

    consoleSpy.mockRestore();
  });
});
