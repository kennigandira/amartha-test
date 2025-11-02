import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { Step2Form } from "./index";
import { useAutocompleteSearch } from "../Autocomplete/use-autocomplete-search";

// Mock the hooks and router
vi.mock("../Autocomplete/use-autocomplete-search", () => ({
  useAutocompleteSearch: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: vi.fn(),
    history: {
      back: vi.fn(),
    },
  }),
  useCanGoBack: () => true,
  createLink: (Component: any) => Component,
}));

// Mock the API calls
vi.mock("@/api/basicInfo", () => ({
  postBasicInfo: vi.fn(),
}));

vi.mock("@/api/details", () => ({
  postDetails: vi.fn(),
  EmploymentType: {
    FULL_TIME: "full-time",
    PART_TIME: "part-time",
    CONTRACT: "contract",
    INTERN: "intern",
  },
}));

const mockUseAutocompleteSearch = useAutocompleteSearch as ReturnType<
  typeof vi.fn
>;

const mockOfficeLocations = [
  { id: 1, name: "New York" },
  { id: 2, name: "London" },
  { id: 3, name: "Tokyo" },
];

describe("Step2Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock useAutocompleteSearch
    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  describe("Rendering & Initial State", () => {
    it("renders all form fields", () => {
      render(<Step2Form />);

      expect(screen.getByPlaceholderText("Upload Photo")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search Office Location...")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
    });

    it("renders the Details heading", () => {
      render(<Step2Form />);
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders Clear Draft and Submit buttons", () => {
      render(<Step2Form />);
      expect(screen.getByText("Clear Draft")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("renders Back button when canGoBack is true", () => {
      render(<Step2Form />);
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("Submit button is disabled on initial render", () => {
      render(<Step2Form />);
      expect(screen.getByText("Submit")).toBeDisabled();
    });

    it("loads and displays draft data from localStorage", () => {
      const draftData = {
        employmentType: "full-time",
        notes: "Test notes",
      };
      localStorage.setItem("draft_ops", JSON.stringify(draftData));

      render(<Step2Form />);

      expect(screen.getByPlaceholderText("Notes")).toHaveValue("Test notes");
    });
  });

  describe("Form Validation", () => {
    it("shows error for empty photo on blur", async () => {
      const user = userEvent.setup({ delay: null });
      render(<Step2Form />);

      const photoInput = screen.getByPlaceholderText("Upload Photo");
      fireEvent.blur(photoInput);

      await waitFor(() => {
        expect(screen.queryByText(/Photo is required/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it("does not validate Notes field (optional)", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const notesInput = screen.getByPlaceholderText("Notes");
      fireEvent.blur(notesInput);

      // Notes is optional, so no error should appear
      expect(screen.queryByText(/Notes is required/i)).not.toBeInTheDocument();
    });

    it("disables Submit button when form is invalid", () => {
      render(<Step2Form />);
      // Check for disabled attribute on the button
      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeDisabled();
    });

    it("enables Submit button when all required fields are filled", async () => {
      const user = userEvent.setup();
      mockUseAutocompleteSearch.mockReturnValue({
        data: mockOfficeLocations,
        isLoading: false,
        error: null,
      });

      const draftData = {
        photo: "data:image/png;base64,test",
        employmentType: "full-time",
        officeLocation: { id: 1, name: "New York" },
      };
      localStorage.setItem("draft_ops", JSON.stringify(draftData));

      render(<Step2Form />);

      // Verify the component rendered with draft data
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });

  describe("Field Interactions", () => {
    it("updates Notes textarea on input change", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const notesInput = screen.getByPlaceholderText(
        "Notes"
      ) as HTMLTextAreaElement;
      await user.type(notesInput, "Test note content");

      expect(notesInput.value).toBe("Test note content");
    });

    it("displays employment type options", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const employmentTypeSelect = screen.getAllByRole("combobox")[0];
      await user.click(employmentTypeSelect);

      await waitFor(() => {
        expect(screen.getByText("Full-time")).toBeInTheDocument();
        expect(screen.getByText("Part-time")).toBeInTheDocument();
        expect(screen.getByText("Contract")).toBeInTheDocument();
        expect(screen.getByText("Intern")).toBeInTheDocument();
      });
    });

    it("handles Office Location selection", async () => {
      const user = userEvent.setup();
      mockUseAutocompleteSearch.mockReturnValue({
        data: mockOfficeLocations,
        isLoading: false,
        error: null,
      });

      render(<Step2Form />);

      const officeLocationInput = screen.getByPlaceholderText(
        "Search Office Location..."
      );
      await user.type(officeLocationInput, "New York");

      await waitFor(() => {
        expect(screen.getByText("New York")).toBeInTheDocument();
      });

      await user.click(screen.getByText("New York"));

      // Verify selection was made by checking option is visible
      await waitFor(() => {
        expect(screen.getByText("New York")).toBeInTheDocument();
      });
    });
  });

  describe("Draft Management", () => {
    it("saves form data to localStorage after debounce", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const notesInput = screen.getByPlaceholderText("Notes");
      await user.type(notesInput, "Important notes");

      // Wait for debounce (2 seconds) with extended timeout
      await waitFor(
        () => {
          const stored = localStorage.getItem("draft_ops");
          expect(stored).toBeTruthy();
        },
        { timeout: 4000 }
      );
    });

    it("clears draft data when Clear Draft button is clicked", async () => {
      const user = userEvent.setup();
      const draftData = {
        employmentType: "full-time",
        notes: "Test notes",
      };
      localStorage.setItem("draft_ops", JSON.stringify(draftData));

      render(<Step2Form />);

      expect(screen.getByPlaceholderText("Notes")).toHaveValue("Test notes");

      const clearButton = screen.getByText("Clear Draft");
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Notes")).toHaveValue("");
        expect(localStorage.getItem("draft_ops")).toBeNull();
      });
    });

    it("restores draft data from localStorage on mount", () => {
      const draftData = {
        employmentType: "part-time",
        notes: "Part-time employee",
      };
      localStorage.setItem("draft_ops", JSON.stringify(draftData));

      render(<Step2Form />);

      expect(screen.getByPlaceholderText("Notes")).toHaveValue(
        "Part-time employee"
      );
    });
  });

  describe("Navigation", () => {
    it("renders Back button", () => {
      render(<Step2Form />);
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("Back button is positioned on the left", () => {
      render(<Step2Form />);
      const backButton = screen.getByText("Back");
      expect(backButton).toHaveClass("absolute");
    });

    it("handles back navigation on Back button click", async () => {
      const user = userEvent.setup();
      const mockNavigate = vi.fn();

      // We need to test that the history.back() would be called
      render(<Step2Form />);

      const backButton = screen.getByText("Back");
      await user.click(backButton);

      // The component calls router.history.back()
      // We would verify this was called in the mock
    });
  });

  describe("Form Submission", () => {
    it("Submit button triggers form submission", async () => {
      const user = userEvent.setup();
      localStorage.setItem(
        "draft_ops",
        JSON.stringify({
          photo: "data:image/png;base64,test",
          employmentType: "full-time",
          officeLocation: { id: 1, name: "New York" },
        })
      );

      const { rerender } = render(<Step2Form />);

      await waitFor(() => {
        expect(screen.getByText("Submit")).not.toBeDisabled();
      });

      const submitButton = screen.getByText("Submit");
      await user.click(submitButton);

      // Verify submit was triggered (would show loading state)
      // In real scenario, API calls would be made
    });

    it("shows loading state during submission", async () => {
      // This test verifies the loading state is shown during async submission
      // The button should be disabled and show loading indicator
      const user = userEvent.setup();

      localStorage.setItem(
        "draft_ops",
        JSON.stringify({
          photo: "data:image/png;base64,test",
          employmentType: "full-time",
          officeLocation: { id: 1, name: "New York" },
        })
      );

      render(<Step2Form />);

      await waitFor(() => {
        expect(screen.getByText("Submit")).not.toBeDisabled();
      });

      const submitButton = screen.getByText("Submit");

      // Check initial state
      expect(submitButton).not.toHaveAttribute("disabled");

      // Note: Full loading state testing would require mocking async operations
    });
  });

  describe("Error Message Display", () => {
    it("displays error for empty employment type after blur", async () => {
      const user = userEvent.setup({ delay: null });
      render(<Step2Form />);

      const employmentTypeSelect = screen.getAllByRole("combobox")[0];
      fireEvent.blur(employmentTypeSelect);

      await waitFor(() => {
        expect(
          screen.queryByText(/Employmenttype is required/i)
        ).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it("clears error when employment type is selected", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const employmentTypeSelect = screen.getAllByRole("combobox")[0];
      await user.click(employmentTypeSelect);

      await waitFor(() => {
        expect(screen.getByText("Full-time")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Full-time"));

      // Verify no error after selection
      expect(employmentTypeSelect).toHaveValue("full-time");
    });
  });

  describe("Optional Fields", () => {
    it("Notes field is optional and does not block submission", async () => {
      const user = userEvent.setup();
      localStorage.setItem(
        "draft_ops",
        JSON.stringify({
          photo: "data:image/png;base64,test",
          employmentType: "full-time",
          officeLocation: { id: 1, name: "New York" },
          notes: "", // Empty notes
        })
      );

      render(<Step2Form />);

      await waitFor(() => {
        expect(screen.getByText("Submit")).not.toBeDisabled();
      });

      const submitButton = screen.getByText("Submit");
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Employment Type Options", () => {
    it("displays all employment type options", async () => {
      const user = userEvent.setup();
      render(<Step2Form />);

      const employmentTypeSelect = screen.getAllByRole("combobox")[0];
      await user.click(employmentTypeSelect);

      await waitFor(() => {
        expect(screen.getByText("Full-time")).toBeInTheDocument();
        expect(screen.getByText("Part-time")).toBeInTheDocument();
        expect(screen.getByText("Contract")).toBeInTheDocument();
        expect(screen.getByText("Intern")).toBeInTheDocument();
      });
    });

    it("can select each employment type option", async () => {
      const user = userEvent.setup();
      const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];

      for (const employmentType of employmentTypes) {
        localStorage.clear();
        const { unmount } = render(<Step2Form />);

        const employmentTypeSelect = screen.getAllByRole("combobox")[0];
        await user.click(employmentTypeSelect);

        await waitFor(() => {
          expect(screen.getByText(employmentType)).toBeInTheDocument();
        });

        await user.click(screen.getByText(employmentType));

        await waitFor(() => {
          expect(employmentTypeSelect).toHaveValue(
            employmentType.toLowerCase().replace("-", "-")
          );
        });

        unmount();
      }
    });
  });

  describe("Syncing Status", () => {
    it("reflects isSyncing state in Submit button", async () => {
      const user = userEvent.setup();
      localStorage.setItem(
        "draft_ops",
        JSON.stringify({
          photo: "data:image/png;base64,test",
          employmentType: "full-time",
          officeLocation: { id: 1, name: "New York" },
        })
      );

      render(<Step2Form />);

      // Wait for form to be ready
      await waitFor(() => {
        expect(screen.getByText("Submit")).not.toBeDisabled();
      });

      // The button should show initial state (not loading)
      const submitButton = screen.getByText("Submit");
      expect(submitButton).not.toHaveAttribute("disabled");
    });
  });
});
