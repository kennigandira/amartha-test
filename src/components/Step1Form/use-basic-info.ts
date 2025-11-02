import type { BasicInfo } from "@/api/basicInfo";
import { getBasicInfo } from "@/api/basicInfo";
import { useEffect, useState } from "react";

interface UseBasicInfoParams {
  department?: number;
}

export function useBasicInfo(params?: UseBasicInfoParams) {
  const [basicInfo, setBasicInfo] = useState<BasicInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const department = params?.department;

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const query = department ? { department } : undefined;
        const data = await getBasicInfo({ query, returnAll: true });

        setBasicInfo(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(String(err) || "Failed to fetch basic info"),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [department]);

  return { data: basicInfo, isLoading, error };
}
