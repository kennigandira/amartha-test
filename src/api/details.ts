import type { Details } from "@/components/Step2Form";

const DETAILS_ENDPOINT = `${import.meta.env.VITE_DETAILS_SERVICE_PORT}/details`;

export async function postDetails(body: any) {
  try {
    const res = await fetch(DETAILS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to post details");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

type DetailsQuery = {
  employeeId?: string;
  [key: string]: string | number | undefined;
};

interface GetDetails {
  query?: DetailsQuery;
  returnAll?: boolean;
}

export async function getDetails({
  query,
  returnAll,
}: GetDetails): Promise<Details | Details[] | null> {
  try {
    const queryString = query
      ? new URLSearchParams(
          Object.entries(query)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ).toString()
      : "";

    const res = await fetch(
      `${DETAILS_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch details: ${res.statusText}`);
    }

    const data: Details[] = await res.json();

    if (returnAll || !query) {
      return data;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDetailsCount(): Promise<number> {
  try {
    const res = await fetch(`${DETAILS_ENDPOINT}?_page=1&_limit=1`);
    if (!res.ok) {
      throw new Error(`Failed to get details count: ${res.statusText}`);
    }
    return parseInt(res.headers.get("X-Total-Count") || "0");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
