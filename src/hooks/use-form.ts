import { useState, useCallback, useEffect } from "react";
import { Role } from "@/constants/role";
import type { DRAFT_KEYS } from "@/constants/draft";
import type { Department } from "@/components/Step1Form/use-departments";
import { useDebounce } from "./useDebounce";

interface ValidationRule<T = any> {
  required: boolean;
  validate?: (value: T) => boolean;
}

export type ValidationSchema = {
  [key: string]: ValidationRule;
};

interface BasicInfo {
  fullName: string;
  email: string;
  department: Department;
  role: Role;
  employeeId: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  department?: string;
  role?: string;
  employeeId?: string;
}

interface TouchedFields {
  fullName: boolean;
  email: boolean;
  department: boolean;
  role: boolean;
  employeeId: boolean;
}

interface ChangeFormDataProps {
  name: string;
  value: string | Department | Role | undefined;
  lsFormKey: DRAFT_KEYS;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useForm = (
  initialState: any,
  lsFormKey: DRAFT_KEYS,
  validationSchema: ValidationSchema,
) => {
  const [formData, setFormData] = useState<Partial<BasicInfo>>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    fullName: false,
    email: false,
    department: false,
    role: false,
    employeeId: false,
  });
  const [isSynced, setIsSynced] = useState(true);

  const debouncedFormData = useDebounce(formData, 2000);

  useEffect(() => {
    setIsSynced(false);
  }, [formData]);

  useEffect(() => {
    if (debouncedFormData) {
      localStorage.setItem(lsFormKey, JSON.stringify(debouncedFormData));
      setIsSynced(true);
    }
  }, [debouncedFormData]);

  const validateDataAgainstSchema = (
    data: Partial<BasicInfo>,
    schema: ValidationSchema,
  ): boolean => {
    return Object.entries(schema).every(([fieldName, rule]) => {
      if (!rule.required) return true;

      if (data && data[fieldName as keyof BasicInfo]) {
        const fieldValue = data[fieldName as keyof BasicInfo];
        if (rule.validate) {
          return rule.validate(fieldValue);
        }
        return !!fieldValue;
      }
      return false;
    });
  };

  const handleClearDraft = () => {
    setFormData({});
    setTouched({
      fullName: false,
      email: false,
      department: false,
      role: false,
      employeeId: false,
    });
    setErrors({});
    localStorage.removeItem(lsFormKey);
  };

  const validateFullName = (): string | undefined => {
    if (!formData?.fullName || formData?.fullName?.trim() === "") {
      return "Full name is required";
    }
    return undefined;
  };

  const validateEmail = (): string | undefined => {
    if (!formData?.email || formData?.email?.trim() === "") {
      return "Email is required";
    }
    if (formData?.email && !EMAIL_REGEX.test(formData.email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateDepartment = (
    department?: BasicInfo["department"],
  ): string | undefined => {
    const deptToValidate = department ? department : formData?.department;
    if (!deptToValidate || deptToValidate.id === 0) {
      return "Department is required";
    }
    return undefined;
  };

  const validateRole = (): string | undefined => {
    return undefined;
  };

  const validateEmployeeId = (): string | undefined => {
    if (!formData.employeeId || formData.employeeId.trim() === "") {
      return "Employee ID is required";
    }
    return undefined;
  };

  const validateField = (fieldName: keyof FormErrors, overrideValue?: any) => {
    let error: string | undefined;

    switch (fieldName) {
      case "fullName":
        error = validateFullName();
        break;
      case "email":
        error = validateEmail();
        break;
      case "department":
        error = validateDepartment(overrideValue);
        break;
      case "role":
        error = validateRole();
        break;
      case "employeeId":
        error = validateEmployeeId();
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === undefined;
  };

  const isFormValid = (): boolean => {
    return validateDataAgainstSchema(formData, validationSchema);
  };

  const isLocalStorageInSync = (): boolean => {
    if (!isSynced) return false;

    const lsData = localStorage.getItem(lsFormKey);
    if (!lsData) return false;

    try {
      const parsed = JSON.parse(lsData);
      return validateDataAgainstSchema(parsed, validationSchema);
    } catch {
      return false;
    }
  };

  const isSyncing = (): boolean => {
    return isFormValid() && !isSynced;
  };

  const handleBlur = (fieldName: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    validateField(fieldName);
  };

  const validateAndTouch = (
    fieldName: keyof TouchedFields,
    overrideValue?: any,
  ) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, overrideValue);
  };

  const handleChangeFormData = useCallback(
    ({ name, value }: ChangeFormDataProps) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData],
  );

  const handleInputChange = useCallback(
    (lsFormKey: DRAFT_KEYS, e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      handleChangeFormData({ name, value, lsFormKey });
    },
    [],
  );

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChangeFormData,
    handleInputChange,
    handleBlur,
    validateAndTouch,
    isFormValid,
    isLocalStorageInSync,
    isSyncing,
    handleClearDraft,
  };
};
