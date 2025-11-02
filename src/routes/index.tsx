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
import { Pagination } from "@/components/Pagination";

const ITEMS_PER_PAGE = 8;

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

const TEXTS = {
  OUR_TEAM: "Our Team",
  ADD_EMPLOYEE: "Add Employee",
  LOADING_EMPLOYEES: "Loading employees...",
  ERROR_LOADING_EMPLOYEES: "Error loading employees",
  NO_EMPLOYEES_FOUND: "No employees found",
  NO_EMPLOYEES_MESSAGE: "Click 'Add Employee' to add your first team member",
};

const classes = {
  container: "text-zinc-800 max-w-4xl px-6 pt-8 min-h-screen",
  headerContainer: "flex justify-between items-center mb-8 gap-8 md:p-0",
  title: "text-4xl text-center font-light",
  loadingContainer: "flex justify-center items-center py-10",
  loadingText: "ml-3 text-zinc-600",
  errorContainer: "border-2 border-red-400 bg-red-50 p-4 rounded-lg mb-5",
  errorTitle: "text-red-700 font-bold",
  errorMessage: "text-red-600 text-sm",
  noEmployeesContainer:
    "border-2 border-zinc-300 bg-zinc-50 p-8 rounded-lg text-center",
  noEmployeesTitle: "text-zinc-600 text-lg",
  noEmployeesMessage: "text-zinc-500 text-sm mt-2",
  employeesContainer: "grid grid-cols-1 md:grid-cols-4 gap-4",
  spinner: "h-8 w-8",
};

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
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <h1 className={classes.title}>{TEXTS.OUR_TEAM}</h1>
        <LinkButton to="/wizard">{TEXTS.ADD_EMPLOYEE}</LinkButton>
      </div>

      {isLoading && (
        <div className={classes.loadingContainer}>
          <Spinner className={classes.spinner} />
          <span className={classes.loadingText}>{TEXTS.LOADING_EMPLOYEES}</span>
        </div>
      )}

      {error && (
        <div className={classes.errorContainer}>
          <p className={classes.errorTitle}>{TEXTS.ERROR_LOADING_EMPLOYEES}</p>
          <p className={classes.errorMessage}>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && employees.length === 0 && (
        <div className={classes.noEmployeesContainer}>
          <p className={classes.noEmployeesTitle}>{TEXTS.NO_EMPLOYEES_FOUND}</p>
          <p className={classes.noEmployeesMessage}>
            {TEXTS.NO_EMPLOYEES_MESSAGE}
          </p>
        </div>
      )}

      {!isLoading && !error && employees.length > 0 && (
        <div className={classes.employeesContainer}>
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
