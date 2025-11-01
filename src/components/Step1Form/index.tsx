import { Input } from "../Input";
import { Select } from "../Select";
import { Button, ButtonVariant } from "../Button";
import { Autocomplete } from "../Autocomplete";
import { useCallback } from "react";
import { Role } from "@/constants/role";
import { LinkButton } from "../LinkButton";
import { useForm, type ValidationSchema } from "../../hooks/use-form";
import { DRAFT_KEYS } from "@/constants/draft";
import {
  useBasicInfo,
  type BasicInfo,
  type Department,
} from "./use-basic-info";

const DEPARTMENTS_ENDPOINT = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/departments`;

const ROLE_OPTIONS: { children: string; value: Role }[] = [
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
  const {
    formData,
    setFormData,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    validateAndTouch,
    isReadyToSubmit,
    isSyncing,
    handleChangeFormData,
    handleClearDraft,
  } = useForm<BasicInfo>(LS_ADMIN_FORM_KEY, ADMIN_VALIDATION_SCHEMA);
  const { data: basicInfo } = useBasicInfo();

  const handleDepartmentSelect = (option: Department | null) => {
    const departmentCode = option
      ? option.name.substring(0, 3).toUpperCase()
      : "";

    const employeesInDepartment = option
      ? basicInfo.filter((employee) => employee.department.id === option?.id)
      : [];
    const nextEmployeeNumber = employeesInDepartment.length + 1;
    const employeeId = option
      ? `${departmentCode}-${nextEmployeeNumber.toString().padStart(3, "0")}`
      : "";
    setFormData((prev) => ({
      ...prev,
      department: option || undefined,
      employeeId,
    }));
    validateAndTouch("department", option || undefined);
  };

  const handleRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      handleChangeFormData({
        name: "role",
        value: value,
      });
      validateAndTouch("role", value);
    },
    [handleChangeFormData, validateAndTouch],
  );

  return (
    <>
      <div className="relative">
        <h2 className="text-2xl font-bold mb-5">Basic Info</h2>
      </div>
      <Input
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={formData?.fullName || ""}
        onChange={handleInputChange}
        onBlur={() => handleBlur("fullName")}
        errorMessage={
          touched.fullName && errors.fullName ? errors.fullName : undefined
        }
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData?.email || ""}
        onChange={handleInputChange}
        onBlur={() => handleBlur("email")}
        errorMessage={touched.email && errors.email ? errors.email : undefined}
      />
      <Autocomplete
        name="department"
        placeholder="Search department..."
        endpoint={DEPARTMENTS_ENDPOINT}
        onOptionSelect={handleDepartmentSelect}
        value={formData?.department?.name || ""}
        onBlur={() => handleBlur("department")}
        errorMessage={
          touched.department && errors.department
            ? errors.department
            : undefined
        }
      />
      <Select
        name="role"
        options={ROLE_OPTIONS}
        value={formData?.role || ""}
        onChange={handleRoleChange}
        onBlur={() => handleBlur("role")}
        errorMessage={touched.role && errors.role ? errors.role : undefined}
      />
      <Input
        key={formData?.employeeId || "empty"}
        name="employeeId"
        disabled
        type="text"
        value={formData?.employeeId || ""}
        errorMessage={
          touched.employeeId && errors.employeeId
            ? errors.employeeId
            : undefined
        }
      />
      <div className="flex gap-2 justify-center">
        <Button
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
          type="button"
        >
          Clear Draft
        </Button>
        <LinkButton
          disabled={!isReadyToSubmit()}
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
