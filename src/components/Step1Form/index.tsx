import { Input } from "../Input";
import { Select } from "../Select";
import { Button, ButtonVariant } from "../Button";
import { Autocomplete } from "../Autocomplete";
import { useCallback, useMemo } from "react";
import { LinkButton } from "../LinkButton";
import { useForm, type ValidationSchema } from "../../hooks/use-form";
import { DRAFT_KEYS } from "@/constants/draft";
import { Role, type BasicInfo, type Department } from "@/api/basicInfo";
import { useBasicInfo } from "./use-basic-info";

const DEPARTMENTS_ENDPOINT = `${import.meta.env.VITE_BASIC_INFO_SERVICE_PORT}/departments`;

const ROLE_OPTIONS: { label: string; value: Role }[] = [
  {
    label: "Ops",
    value: Role.OPS,
  },
  {
    label: "Admin",
    value: Role.ADMIN,
  },
  {
    label: "Engineer",
    value: Role.ENGINEER,
  },
  {
    label: "Finance",
    value: Role.FINANCE,
  },
];

const TEXTS = {
  TITLE: "Basic Info",
  FULL_NAME: "Full Name",
  EMAIL: "Email",
  DEPARTMENT: "Search department...",
  ROLE: "Select role...",
  EMPLOYEE_ID: "Employee ID",
  CLEAR_DRAFT: "Clear Draft",
  NEXT: "Next",
  BASIC_INFO: "Basic Info",
};

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
    validate: (value) => !!value,
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

const classes = {
  container: "relative",
  title: "text-2xl font-bold mb-5",
  buttonsContainer: "flex gap-2 justify-center",
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

  const errorMessages = useMemo(() => {
    return {
      fullName:
        touched.fullName && errors.fullName ? errors.fullName : undefined,
      email: touched.email && errors.email ? errors.email : undefined,
      department:
        touched.department && errors.department ? errors.department : undefined,
      role: touched.role && errors.role ? errors.role : undefined,
      employeeId:
        touched.employeeId && errors.employeeId ? errors.employeeId : undefined,
    };
  }, [errors]);

  const handleDepartmentSelect = useCallback(
    (option: Department | null) => {
      const departmentCode = option
        ? option.name.substring(0, 3).toUpperCase()
        : "";

      const employeesInDepartment = option
        ? basicInfo.filter((employee) => employee.department?.id === option?.id)
        : [];
      const nextEmployeeNumber = employeesInDepartment.length + 1;
      const employeeId = option
        ? `${departmentCode}-${nextEmployeeNumber.toString().padStart(3, "0")}`
        : "";

      setFormData((prev: BasicInfo) => ({
        ...prev,
        department: option || undefined,
        employeeId,
      }));
      validateAndTouch("department", option || undefined);
    },
    [basicInfo, setFormData, validateAndTouch],
  );

  const handleRoleChange = useCallback(
    (value: string | number) => {
      handleChangeFormData({
        name: "role",
        value: value,
      });
    },
    [handleChangeFormData],
  );

  return (
    <>
      <div className={classes.container}>
        <h2 className={classes.title}>{TEXTS.BASIC_INFO}</h2>
      </div>
      <Input
        name="fullName"
        type="text"
        placeholder={TEXTS.FULL_NAME}
        value={formData?.fullName || ""}
        onChange={handleInputChange}
        onBlur={() => handleBlur("fullName")}
        errorMessage={errorMessages.fullName}
      />
      <Input
        name="email"
        type="email"
        placeholder={TEXTS.EMAIL}
        value={formData?.email || ""}
        onChange={handleInputChange}
        onBlur={() => handleBlur("email")}
        errorMessage={errorMessages.email}
      />
      <Autocomplete
        name="department"
        placeholder={TEXTS.DEPARTMENT}
        endpoint={DEPARTMENTS_ENDPOINT}
        onOptionSelect={handleDepartmentSelect}
        value={formData?.department?.name}
        onBlur={() => handleBlur("department")}
        errorMessage={errorMessages.department}
      />
      <Select
        name="role"
        options={ROLE_OPTIONS}
        value={formData?.role}
        onChange={handleRoleChange}
        onBlur={() => handleBlur("role")}
        errorMessage={errorMessages.role}
      />
      <Input
        key={formData?.employeeId || "empty"}
        name="employeeId"
        placeholder={TEXTS.EMPLOYEE_ID}
        disabled
        type="text"
        value={formData?.employeeId}
        errorMessage={errorMessages.employeeId}
      />
      <div className={classes.buttonsContainer}>
        <Button
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
          type="button"
        >
          {TEXTS.CLEAR_DRAFT}
        </Button>
        <LinkButton
          disabled={!isReadyToSubmit()}
          loading={isSyncing()}
          to="/wizard"
          search={{ role: "ops" }}
        >
          {TEXTS.NEXT}
        </LinkButton>
      </div>
    </>
  );
};
