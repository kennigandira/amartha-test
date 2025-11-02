import { useState, useEffect, useCallback } from "react";
import { getDetails, getDetailsCount } from "@/api/details";
import { getBasicInfo, Role, type Department } from "@/api/basicInfo";
import type { OfficeLocation } from "@/components/Step2Form";

export interface EmployeeDetails {
  id?: number;
  employmentType: "full-time" | "part-time" | "contract" | "intern";
  officeLocation: OfficeLocation;
  notes: string;
  photo: string;
  employeeId?: string;
}

export interface MergedEmployee {
  email?: string;
  fullName?: string;
  employeeId?: string;
  department?: Department;
  role?: Role;
  employmentType?: string;
  officeLocation: string;
  notes?: string;
  photo?: string;
}
export function useEmployees(page = 1, limit = 10) {
  const [employees, setEmployees] = useState<MergedEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const detailsData = await getDetails({
        query: { _page: page, _limit: limit },
        returnAll: true,
      });

      const count = await getDetailsCount();
      setTotalCount(count);

      if (!detailsData) {
        setEmployees([]);
        setIsLoading(false);
        return;
      }

      const detailsArray = Array.isArray(detailsData)
        ? detailsData
        : [detailsData];

      if (detailsArray.length === 0) {
        setEmployees([]);
        setIsLoading(false);
        return;
      }
      const partialEmployees: MergedEmployee[] = detailsArray.map((detail) => ({
        employeeId: detail.employeeId,
        employmentType: detail.employmentType,
        officeLocation: detail.officeLocation?.name || "",
        notes: detail.notes,
        photo: detail.photo,
        email: undefined,
        fullName: undefined,
        department: undefined,
        role: undefined,
      }));

      setEmployees(partialEmployees);

      try {
        const employeeIds = detailsArray
          .map((detail) => detail.employeeId)
          .filter((id): id is string => !!id);

        if (employeeIds.length > 0) {
          await Promise.all(
            employeeIds.map(async (id) => {
              try {
                const basicInfo = await getBasicInfo({
                  query: { employeeId: id },
                  returnAll: true,
                });
                const basicInfoData = Array.isArray(basicInfo)
                  ? basicInfo[0]
                  : basicInfo;

                if (basicInfoData) {
                  setEmployees((prev) =>
                    prev.map((emp) =>
                      emp.employeeId?.toLowerCase() === id.toLowerCase()
                        ? {
                            ...emp,
                            email: basicInfoData.email,
                            fullName: basicInfoData.fullName,
                            department: basicInfoData.department,
                            role: basicInfoData.role,
                          }
                        : emp,
                    ),
                  );
                }
              } catch (individualError) {
                console.warn(
                  `Failed to fetch basicInfo for employeeId: ${id}`,
                  individualError,
                );
              }
            }),
          );
        }
      } catch (basicInfoError) {
        console.error(
          "Failed to fetch basicInfo, showing details only:",
          basicInfoError,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch employees"),
      );
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: employees,
    isLoading,
    error,
    totalCount,
  };
}
