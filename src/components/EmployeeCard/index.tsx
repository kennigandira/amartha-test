import type { MergedEmployee } from "@/hooks/use-employees";

interface EmployeeCardProps {
  employee: MergedEmployee;
}

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/80/e4e4e7/52525b?text=No+Photo";

const PLACEHOLDER_TEXT = {
  fullName: "No name provided",
  role: "No role specified",
  location: "No location specified",
  department: "No department",
} as const;

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const departmentName = employee.department?.name;
  const location = employee.officeLocation ?? PLACEHOLDER_TEXT.location;
  const displayText = departmentName
    ? `${departmentName} in ${location}`
    : location;

  return (
    <div className="w-fit md:w-auto border border-neutral-400 p-4 gap-6 rounded-3xl hover:-translate-y-2">
      <img
        className="aspect-square w-full rounded-3xl object-cover"
        src={employee.photo || PLACEHOLDER_IMAGE}
        alt={employee.fullName || PLACEHOLDER_TEXT.fullName}
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />
      <div className="text-zinc-800 mt-4">
        <div>
          <span className="mr-2 text-xl">
            {employee.fullName || PLACEHOLDER_TEXT.fullName}
          </span>
        </div>
        <div className="text-sm capitalize text-neutral-500">
          {employee.role || PLACEHOLDER_TEXT.role}
        </div>
        <div className="mt-2 text-neutral-800">{displayText}</div>
      </div>
    </div>
  );
};
