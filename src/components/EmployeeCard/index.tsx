import type { MergedEmployee } from "@/hooks/use-employees";

interface EmployeeCardProps {
  employee: MergedEmployee;
}

const classes = {
  employeeCard:
    "w-fit md:w-auto border border-neutral-400 p-4 gap-6 rounded-3xl hover:-translate-y-2",
  employeePhoto: "aspect-square w-full rounded-3xl object-cover",
  employeeName: "mr-2 text-xl",
  employeeRole: "text-sm capitalize text-neutral-500",
  employeeLocation: "mt-2 text-neutral-800",
  employeeInfo: "text-zinc-800 mt-4",
};

const PLACEHOLDER_TEXT = {
  fullName: "No name provided",
  role: "No role specified",
  location: "No location specified",
  department: "No department",
};

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const departmentName = employee.department?.name;
  const location = employee.officeLocation ?? PLACEHOLDER_TEXT.location;
  const displayText = departmentName
    ? `${departmentName} in ${location}`
    : location;

  return (
    <div className={classes.employeeCard}>
      <img
        className={classes.employeePhoto}
        src={employee.photo}
        alt={employee.fullName || PLACEHOLDER_TEXT.fullName}
      />
      <div className={classes.employeeInfo}>
        <div>
          <span className={classes.employeeName}>
            {employee.fullName || PLACEHOLDER_TEXT.fullName}
          </span>
        </div>
        <div className={classes.employeeRole}>
          {employee.role || PLACEHOLDER_TEXT.role}
        </div>
        <div className={classes.employeeLocation}>{displayText}</div>
      </div>
    </div>
  );
};
