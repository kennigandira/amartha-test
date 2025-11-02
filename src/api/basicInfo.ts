export interface Department {
  id: number;
  name: string;
}

export const Role = {
  OPS: "ops",
  ADMIN: "admin",
  ENGINEER: "engineer",
  FINANCE: "finance",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface BasicInfo {
  id?: number;
  fullName?: string;
  email?: string;
  department?: Department;
  role?: Role;
  employeeId?: string;
}

const BASIC_INFO_ENDPOINT = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/basicInfo`;

export async function postBasicInfo(body: any) {
  try {
    const response = await fetch(BASIC_INFO_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to post basicInfo");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
}

type BasicInfoQuery = {
  employeeId?: string;
  [key: string]: string | number | undefined;
};

interface GetBasicInfo {
  query?: BasicInfoQuery;
  returnAll?: boolean;
}

export async function getBasicInfo({
  query,
  returnAll,
}: GetBasicInfo): Promise<BasicInfo | BasicInfo[] | null> {
  try {
    const queryString = query
      ? new URLSearchParams(
          Object.entries(query)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)]),
        ).toString()
      : "";

    const res = await fetch(`${BASIC_INFO_ENDPOINT}?${queryString}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch basic info: ${res.statusText}`);
    }

    const data: BasicInfo[] = await res.json();

    if (returnAll || !query) {
      return data;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
