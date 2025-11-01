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

export interface BasicInfo {
  fullName: string;
  email: string;
  department: Department;
  role: Role;
  employeeId: string;
}

type FormErrors = Record<string, string | undefined>;

type TouchedFields = Record<string, boolean>;

interface ChangeFormDataProps {
  name: string;
  value: string | Department | Role | undefined;
}

export const useForm = <TFormData extends Record<string, any>>(
  lsFormKey: DRAFT_KEYS,
  validationSchema: ValidationSchema,
) => {
  const lsValues = localStorage.getItem(lsFormKey);
  const initialState = !!lsValues ? JSON.parse(lsValues) : null;
  const [formData, setFormData] = useState<Partial<TFormData>>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
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
    data: Partial<TFormData>,
    schema: ValidationSchema,
  ): boolean => {
    return Object.entries(schema).every(([fieldName, rule]) => {
      if (!rule.required) return true;

      if (data && data[fieldName as keyof TFormData]) {
        const fieldValue = data[fieldName as keyof TFormData];
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
    setTouched({});
    setErrors({});
    localStorage.removeItem(lsFormKey);
  };

  const validateField = (fieldName: string, overrideValue?: any) => {
    const rule = validationSchema[fieldName];

    if (!rule) {
      return true;
    }

    let error: string | undefined;
    const valueToValidate =
      overrideValue !== undefined
        ? overrideValue
        : formData?.[fieldName as keyof TFormData];

    if (rule.required) {
      if (
        !valueToValidate ||
        (typeof valueToValidate === "string" && valueToValidate.trim() === "")
      ) {
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      } else if (rule.validate && !rule.validate(valueToValidate)) {
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is invalid`;
      }
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

  const isReadyToSubmit = (): boolean => {
    return isFormValid() && isSynced;
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [lsFormKey],
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
    isReadyToSubmit,
    isSyncing,
    handleClearDraft,
  };
};
