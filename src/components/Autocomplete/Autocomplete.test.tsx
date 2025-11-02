import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("./use-autocomplete-search", () => ({
  useAutocompleteSearch: vi.fn(),
}));

import { useAutocompleteSearch } from "./use-autocomplete-search";
import { Autocomplete } from ".";

const mockUseAutocompleteSearch = useAutocompleteSearch as ReturnType<
  typeof vi.fn
>;

describe("Autocomplete", () => {
  const endpoint = "/api/search";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with placeholder", () => {
    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Autocomplete endpoint={endpoint} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(<Autocomplete endpoint={endpoint} />);
    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("shows search results and allows selection", async () => {
    const mockOptions = [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
    ];

    mockUseAutocompleteSearch.mockReturnValue({
      data: mockOptions,
      isLoading: false,
      error: null,
    });

    const onOptionSelect = vi.fn();

    render(
      <Autocomplete endpoint={endpoint} onOptionSelect={onOptionSelect} />,
    );

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByText("Banana"));
    expect(onOptionSelect).toHaveBeenCalledWith({ id: 2, name: "Banana" });
    expect(input).toHaveValue("Banana");
  });

  it("shows 'No results found' when empty", async () => {
    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Autocomplete endpoint={endpoint} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "zzz" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });
  });

  it("shows error message when API fails", async () => {
    mockUseAutocompleteSearch.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Something went wrong"),
    });

    render(<Autocomplete endpoint={endpoint} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "err" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading results. Please try again."),
      ).toBeInTheDocument();
    });
  });
});
