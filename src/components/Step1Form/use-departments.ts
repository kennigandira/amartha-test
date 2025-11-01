import { generateOptions } from "@/lib/utils";
import { useEffect, useState } from "react";

const DEPARTMENTS_FETCH_URL = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/departments`;

export interface Department {
  id: number;
  name: string;
}

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    fetch(DEPARTMENTS_FETCH_URL)
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data: generateOptions(departments), isLoading, error };
}
