import { Button, ButtonVariant } from "../Button";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { FileInput } from "../FileInput";
import { useCallback } from "react";
import { LinkButton } from "../LinkButton";
import { Autocomplete } from "../Autocomplete";
import { useForm, type ValidationSchema } from "@/hooks/use-form";
import { DRAFT_KEYS } from "@/constants/draft";

export interface OfficeLocation {
  id: number;
  name: string;
}

const LOCATIONS_ENDPOINT = `${import.meta.env.VITE_DETAILS_SERVICE_PORT}/locations`;

export const EmploymentType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERN: "intern",
} as const;

export interface Details {
  employeeId?: string;
  employmentType: EmploymentType;
  officeLocation: OfficeLocation;
  notes: string;
  photo: string;
}

export type EmploymentType =
  (typeof EmploymentType)[keyof typeof EmploymentType];

const EMPLOYMENT_TYPE_OPTIONS: { children: string; value: EmploymentType }[] = [
  {
    children: "Full-time",
    value: EmploymentType.FULL_TIME,
  },
  {
    children: "Part-time",
    value: EmploymentType.PART_TIME,
  },
  {
    children: "Contract",
    value: EmploymentType.CONTRACT,
  },
  {
    children: "Intern",
    value: EmploymentType.INTERN,
  },
];

const OPS_VALIDATION_SCHEMA: ValidationSchema = {
  photo: {
    required: true,
    validate: (value) => !!value?.trim(),
  },
  employmentType: {
    required: true,
    validate: (value) => !!value,
  },
  officeLocation: {
    required: true,
    validate: (value) => !!value,
  },
  notes: {
    required: true,
    validate: (value) => !!value?.trim(),
  },
};

const LS_OPS_FORM_KEY = DRAFT_KEYS.ops;

export const Step2Form = () => {
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
    handleClearDraft,
    handleSubmit,
  } = useForm<Details>(LS_OPS_FORM_KEY, OPS_VALIDATION_SCHEMA);

  const handleEmploymentTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        employmentType: e.target.value as EmploymentType,
      }));
    },
    [],
  );

  const handleFileChange = useCallback((file: string | null) => {
    setFormData((prev) => ({
      ...prev,
      photo: file || undefined,
    }));
    validateAndTouch("photo", file || undefined);
  }, []);

  const handleOfficeLocationSelect = (option: OfficeLocation | null) => {
    setFormData((prev) => ({
      ...prev,
      officeLocation: option || undefined,
    }));
    validateAndTouch("officeLocation", option || undefined);
  };

  return (
    <>
      <div className="relative">
        <LinkButton
          className="absolute left-0"
          to="/wizard"
          search={{ role: "admin" }}
        >
          Back
        </LinkButton>
        <h2 className="text-2xl font-bold mb-5">Details</h2>
      </div>
      <FileInput
        name="photo"
        value={formData?.photo}
        placeholder="Upload Photo"
        onChange={handleFileChange}
      />
      <Select
        name="employmentType"
        options={EMPLOYMENT_TYPE_OPTIONS}
        value={formData?.employmentType}
        onChange={handleEmploymentTypeChange}
      />
      <Autocomplete
        name="officeLocation"
        placeholder="Search Office Location..."
        endpoint={LOCATIONS_ENDPOINT}
        onOptionSelect={handleOfficeLocationSelect}
        value={formData?.officeLocation?.name || ""}
        onBlur={() => handleBlur("officeLocation")}
        errorMessage={
          touched.officeLocation && errors.officeLocation
            ? errors.officeLocation
            : undefined
        }
      />
      <TextArea
        name="notes"
        placeholder="Notes"
        value={formData?.notes || ""}
        onChange={handleInputChange}
      />
      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
        >
          Clear Draft
        </Button>
        <Button
          loading={isSyncing()}
          disabled={!isReadyToSubmit()}
          onClick={handleSubmit}
          type="button"
        >
          Submit
        </Button>
      </div>
    </>
  );
};
