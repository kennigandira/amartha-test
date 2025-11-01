import { useEffect, useState } from "react";

interface AutocompleteOption {
  id: number;
  name: string;
}

interface UseAutocompleteSearchParams {
  searchQuery: string;
  endpoint: string;
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseAutocompleteSearchResult {
  data: AutocompleteOption[];
  isLoading: boolean;
  error: Error | null;
}

const DEBOUNCE_DELAY = 300;
const MIN_QUERY_LENGTH = 1;

export function useAutocompleteSearch({
  searchQuery,
  endpoint,
  debounceMs = DEBOUNCE_DELAY,
  minQueryLength = MIN_QUERY_LENGTH,
}: UseAutocompleteSearchParams): UseAutocompleteSearchResult {
  const [data, setData] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  useEffect(() => {
    if (debouncedQuery.length < minQueryLength) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    const url = `${endpoint}?name_like=${encodeURIComponent(debouncedQuery)}`;

    fetch(url, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((responseData) => setData(responseData))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => setIsLoading(false));

    return () => abortController.abort();
  }, [debouncedQuery, endpoint, minQueryLength]);

  return { data, isLoading, error };
}
