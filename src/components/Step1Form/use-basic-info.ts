import { useEffect, useState } from "react";
import type { Role } from "@/constants/role";

const BASICINFO_FETCH_URL = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/basicInfo`;

export interface Department {
  id: number;
  name: string;
}

export interface BasicInfo {
  fullName: string;
  email: string;
  department: Department;
  role: Role;
  employeeId: string;
}

interface UseBasicInfoParams {
  department?: number;
}

export function useBasicInfo(params?: UseBasicInfoParams) {
  const [basicInfo, setBasicInfo] = useState<BasicInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState();

  const department = params?.department;

  useEffect(() => {
    const url = department
      ? `${BASICINFO_FETCH_URL}?department=${encodeURIComponent(department)}`
      : BASICINFO_FETCH_URL;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setBasicInfo(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [department]);

  return { data: basicInfo, isLoading, error };
}
