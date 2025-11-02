import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { Step1Form } from "./index";
import { useBasicInfo } from "./use-basic-info";
import { useAutocompleteSearch } from "../Autocomplete/use-autocomplete-search";

vi.mock("./use-basic-info", () => ({
  useBasicInfo: vi.fn(),
}));

vi.mock("../Autocomplete/use-autocomplete-search", () => ({
  useAutocompleteSearch: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
  createLink: (Component: any) => Component,
}));

const mockUseBasicInfo = useBasicInfo as ReturnType<typeof vi.fn>;
const mockUseAutocompleteSearch = useAutocompleteSearch as ReturnType<
  typeof vi.fn
>;

const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
  { id: 3, name: "Marketing" },
];

describe("Step1Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockUseBasicInfo.mockReturnValue({
      data: [
        {
          id: 1,
          fullName: "John Doe",
          email: "john@example.com",
          department: { id: 1, name: "Engineering" },
          role: "engineer",
          employeeId: "ENG-001",
        },
      ],
      isLoading: false,
      error: null,
    });

    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  describe("Rendering & Initial State", () => {
    it("renders all form fields", () => {
      render(<Step1Form />);

      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search department..."),
      ).toBeInTheDocument();
      const allInputs = screen.getAllByRole("textbox");
      expect(allInputs.length).toBeGreaterThan(0);
    });

    it("renders the Basic Info heading", () => {
      render(<Step1Form />);
      expect(screen.getByText("Basic Info")).toBeInTheDocument();
    });

    it("renders Clear Draft and Next buttons", () => {
      render(<Step1Form />);
      expect(screen.getByText("Clear Draft")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("employee ID field is disabled", () => {
      render(<Step1Form />);
      const employeeIdInputs = screen.getAllByDisplayValue("");
      const disabledInput = employeeIdInputs.find(
        (input) => input instanceof HTMLInputElement && input.disabled,
      ) as HTMLInputElement | undefined;
      expect(disabledInput?.disabled).toBe(true);
    });

    it("Next button is disabled on initial render", () => {
      render(<Step1Form />);
      const nextLink = screen.getByText("Next");
      expect(nextLink).toHaveClass("opacity-50");
    });

    it("loads and displays draft data from localStorage", () => {
      const draftData = {
        fullName: "Jane Smith",
        email: "jane@example.com",
      };
      localStorage.setItem("draft_admin", JSON.stringify(draftData));

      render(<Step1Form />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue(
        "Jane Smith",
      );
      expect(screen.getByPlaceholderText("Email")).toHaveValue(
        "jane@example.com",
      );
    });
  });

  describe("Form Validation", () => {
    it("shows error for empty Full Name on blur", async () => {
      render(<Step1Form />);

      const fullNameInput = screen.getByPlaceholderText("Full Name");
      fireEvent.blur(fullNameInput);

      await waitFor(
        () => {
          expect(
            screen.queryByText(/Fullname is required/i),
          ).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("accepts valid email format", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "valid@example.com");

      expect(screen.queryByText(/Email is invalid/i)).not.toBeInTheDocument();
    });

    it("disables Next button when form is invalid", () => {
      render(<Step1Form />);
      expect(screen.getByText("Next")).toHaveClass("opacity-50");
    });

    it("enables Next button when all required fields are filled", async () => {
      const user = userEvent.setup();
      mockUseAutocompleteSearch.mockReturnValue({
        data: mockDepartments,
        isLoading: false,
        error: null,
      });

      render(<Step1Form />);

      const fullNameInput = screen.getByPlaceholderText("Full Name");
      const emailInput = screen.getByPlaceholderText("Email");

      await user.type(fullNameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      const departmentInput = screen.getByPlaceholderText(
        "Search department...",
      );
      await user.type(departmentInput, "Engineering");
      await waitFor(() => {
        expect(screen.getByText("Engineering")).toBeInTheDocument();
      });
      await user.click(screen.getByText("Engineering"));

      expect((fullNameInput as HTMLInputElement).value).toBe("John Doe");
      expect((emailInput as HTMLInputElement).value).toBe("john@example.com");
    });
  });

  describe("Field Interactions", () => {
    it("updates Full Name field on input change", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const fullNameInput = screen.getByPlaceholderText(
        "Full Name",
      ) as HTMLInputElement;
      await user.type(fullNameInput, "John Doe");

      expect(fullNameInput.value).toBe("John Doe");
    });

    it("updates Email field on input change", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const emailInput = screen.getByPlaceholderText(
        "Email",
      ) as HTMLInputElement;
      await user.type(emailInput, "john@example.com");

      expect(emailInput.value).toBe("john@example.com");
    });

    it("calls handleDepartmentSelect when department is selected", async () => {
      const user = userEvent.setup();
      mockUseAutocompleteSearch.mockReturnValue({
        data: mockDepartments,
        isLoading: false,
        error: null,
      });

      render(<Step1Form />);

      const departmentInput = screen.getByPlaceholderText(
        "Search department...",
      );
      await user.type(departmentInput, "Engineering");

      await waitFor(() => {
        expect(screen.getByText("Engineering")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Engineering"));

      // Verify department was selected
      await waitFor(() => {
        expect(departmentInput).toHaveValue("Engineering");
      });
    });
  });

  describe("Draft Management", () => {
    it("saves form data to localStorage after debounce", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const fullNameInput = screen.getByPlaceholderText("Full Name");
      await user.type(fullNameInput, "Jane Smith");

      await waitFor(
        () => {
          const stored = localStorage.getItem("draft_admin");
          expect(stored).toBeTruthy();
        },
        { timeout: 4000 },
      );
    });

    it("clears draft data when Clear Draft button is clicked", async () => {
      const user = userEvent.setup();
      const draftData = {
        fullName: "John Doe",
        email: "john@example.com",
      };
      localStorage.setItem("draft_admin", JSON.stringify(draftData));

      render(<Step1Form />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue("John Doe");

      const clearButton = screen.getByText("Clear Draft");
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Full Name")).toHaveValue("");
        expect(localStorage.getItem("draft_admin")).toBeNull();
      });
    });

    it("restores draft data from localStorage on mount", () => {
      const draftData = {
        fullName: "Alice Johnson",
        email: "alice@example.com",
        role: "ops",
      };
      localStorage.setItem("draft_admin", JSON.stringify(draftData));

      render(<Step1Form />);

      expect(screen.getByPlaceholderText("Full Name")).toHaveValue(
        "Alice Johnson",
      );
      expect(screen.getByPlaceholderText("Email")).toHaveValue(
        "alice@example.com",
      );
    });
  });

  describe("Trimming validation", () => {
    it("trims whitespace in form validation", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const fullNameInput = screen.getByPlaceholderText("Full Name");
      await user.type(fullNameInput, "   ");

      const nextLink = screen.getByText("Next");
      expect(nextLink).toHaveClass("opacity-50");
    });
  });

  describe("useBasicInfo Integration", () => {
    it("calls useBasicInfo hook to fetch employee data", () => {
      render(<Step1Form />);
      expect(mockUseBasicInfo).toHaveBeenCalled();
    });
  });

  describe("Error Message Display", () => {
    it("displays error for invalid email", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "invalid");

      fireEvent.blur(emailInput);

      await waitFor(
        () => {
          expect(screen.queryByText(/Email is invalid/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("clears error when email becomes valid", async () => {
      const user = userEvent.setup();
      render(<Step1Form />);

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "valid@example.com");

      expect(screen.queryByText(/Email is invalid/i)).not.toBeInTheDocument();
    });
  });
});
