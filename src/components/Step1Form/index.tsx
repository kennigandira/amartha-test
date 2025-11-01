import { Input } from "../Input";
import { Select } from "../Select";
import { Button, ButtonVariant } from "../Button";
import { Autocomplete } from "../Autocomplete";
import { useCallback } from "react";
import { Role } from "@/constants/role";
import type { Department } from "./use-departments";
import { LinkButton } from "../LinkButton";
import { useForm, type ValidationSchema } from "../../hooks/use-form";
import { DRAFT_KEYS } from "@/constants/draft";
import { useBasicInfo } from "./use-basic-info";

const DEPARTMENTS_ENDPOINT = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/departments`;

const ROLE_OPTIONS: { children: string; value?: Role }[] = [
  {
    children: "Select a role...",
    value: undefined,
  },
  {
    children: "Ops",
    value: Role.OPS,
  },
  {
    children: "Admin",
    value: Role.ADMIN,
  },
  {
    children: "Engineer",
    value: Role.ENGINEER,
  },
  {
    children: "Finance",
    value: Role.FINANCE,
  },
];

const LS_ADMIN_FORM_KEY = DRAFT_KEYS.admin;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ADMIN_VALIDATION_SCHEMA: ValidationSchema = {
  fullName: {
    required: true,
    validate: (value) => !!value?.trim(),
  },
  email: {
    required: true,
    validate: (value) => !!value?.trim() && EMAIL_REGEX.test(value),
  },
  department: {
    required: true,
    validate: (value) => !!value && value.id !== 0,
  },
  employeeId: {
    required: true,
    validate: (value) => !!value?.trim(),
  },
  role: {
    required: true,
    validate: (value) => !!value,
  },
};

export const Step1Form = () => {
  const lsValues = localStorage.getItem(LS_ADMIN_FORM_KEY);
  const currentDraftAdmin = !!lsValues ? JSON.parse(lsValues) : null;
  const {
    formData,
    setFormData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAndTouch,
    isFormValid,
    isLocalStorageInSync,
    isSyncing,
    handleChangeFormData,
    handleClearDraft,
  } = useForm(currentDraftAdmin, LS_ADMIN_FORM_KEY, ADMIN_VALIDATION_SCHEMA);
  const { data: basicInfo } = useBasicInfo();

  const handleDepartmentSelect = (option: Department | null) => {
    if (option) {
      const departmentCode = option
        ? option.name.substring(0, 3).toUpperCase()
        : "";

      const employeesInDepartment = basicInfo.filter((employee) =>
        employee.department.some((dept) => dept.id === option?.id),
      );
      const nextEmployeeNumber = employeesInDepartment.length + 1;
      const employeeId = option
        ? `${departmentCode}-${nextEmployeeNumber.toString().padStart(3, "0")}`
        : "";
      setFormData((prev) => ({ ...prev, department: option, employeeId }));
      validateAndTouch("department", option || undefined);
    }
  };

  const handleRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChangeFormData({
        name: "role",
        value: e.target.value,
        lsFormKey: LS_ADMIN_FORM_KEY,
      });
    },
    [],
  );

  return (
    <>
      <div className="relative">
        <h2 className="text-2xl font-bold mb-5">Basic Info</h2>
      </div>
      <div className="w-full">
        <Input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={formData?.fullName || ""}
          onChange={(e) => handleInputChange(LS_ADMIN_FORM_KEY, e)}
          onBlur={() => handleBlur("fullName")}
        />
        {touched.fullName && errors.fullName && (
          <p className="text-red-600 text-xs mt-1 ml-1">{errors.fullName}</p>
        )}
      </div>
      <div className="w-full">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData?.email || ""}
          onChange={(e) => handleInputChange(LS_ADMIN_FORM_KEY, e)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>
        )}
      </div>
      <div className="w-full">
        <Autocomplete
          name="department"
          placeholder="Search department..."
          endpoint={DEPARTMENTS_ENDPOINT}
          onOptionSelect={handleDepartmentSelect}
          value={formData?.department?.name || ""}
          onBlur={() => handleBlur("department")}
        />
        {touched.department && errors.department && (
          <p className="text-red-600 text-xs mt-1 ml-1">{errors.department}</p>
        )}
      </div>
      <div className="w-full">
        <Select
          name="role"
          options={ROLE_OPTIONS}
          value={formData?.role || ""}
          onChange={handleRoleChange}
          onBlur={() => handleBlur("role")}
        />
        {touched.role && errors.role && (
          <p className="text-red-600 text-xs mt-1 ml-1">{errors.role}</p>
        )}
      </div>
      <div className="w-full">
        <Input
          key={formData?.employeeId || "empty"}
          name="employeeId"
          disabled
          type="text"
          value={formData?.employeeId || ""}
        />
        {touched.employeeId && errors.employeeId && (
          <p className="text-red-600 text-xs mt-1 ml-1">{errors.employeeId}</p>
        )}
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
          type="button"
        >
          Clear Draft
        </Button>
        <LinkButton
          disabled={!isFormValid() || !isLocalStorageInSync()}
          loading={isSyncing()}
          to="/wizard"
          search={{ role: "ops" }}
        >
          Next
        </LinkButton>
      </div>
    </>
  );
};
