import { useEffect } from "react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { LinkButton } from "@/components/LinkButton";
import { Spinner } from "@/components/Spinner";
import { useEmployees } from "@/hooks/use-employees";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Pagination, ITEMS_PER_PAGE } from "@/components/Pagination";

export type HomepageSearch = {
  page?: number;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, number>): HomepageSearch => {
    return {
      page: search.page as number,
    };
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/" });
  const searchParams = useSearch({ from: "/" });
  const requestedPage = Number(searchParams.page) || 1;

  const {
    data: employees,
    isLoading,
    error,
    totalCount,
  } = useEmployees(requestedPage, ITEMS_PER_PAGE);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  useEffect(() => {
    if (requestedPage !== currentPage && totalCount > 0) {
      navigate({ search: { page: currentPage }, replace: true });
    }
  }, [requestedPage, currentPage, totalCount, navigate]);

  return (
    <div className="text-zinc-800 max-w-4xl px-6 pt-8 min-h-screen">
      <div className="flex justify-between items-center mb-8 gap-8 md:p-0">
        <h1 className="text-4xl text-center font-light">Our Team</h1>
        <LinkButton to="/wizard">Add Employee</LinkButton>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Spinner className="h-8 w-8" />
          <span className="ml-3 text-zinc-600">Loading employees...</span>
        </div>
      )}

      {error && (
        <div className="border-2 border-red-400 bg-red-50 p-4 rounded-lg mb-5">
          <p className="text-red-700 font-bold">Error loading employees</p>
          <p className="text-red-600 text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && employees.length === 0 && (
        <div className="border-2 border-zinc-300 bg-zinc-50 p-8 rounded-lg text-center">
          <p className="text-zinc-600 text-lg">No employees found</p>
          <p className="text-zinc-500 text-sm mt-2">
            Click "Add Employee" to add your first team member
          </p>
        </div>
      )}

      {!isLoading && !error && employees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <EmployeeCard key={employee.email} employee={employee} />
          ))}
        </div>
      )}

      {!isLoading && !error && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
