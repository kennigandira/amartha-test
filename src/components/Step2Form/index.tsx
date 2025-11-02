import { Button, ButtonVariant } from "../Button";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { FileInput } from "../FileInput";
import { useCallback } from "react";
import { Autocomplete } from "../Autocomplete";
import { useForm, type ValidationSchema } from "@/hooks/use-form";
import { DRAFT_KEYS } from "@/constants/draft";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  EmploymentType,
  type Details,
  type OfficeLocation,
} from "@/api/details";

const classes = {
  container: "relative",
  backButton: "absolute left-0",
  title: "text-2xl font-bold mb-5",
  buttonsContainer: "flex gap-2 justify-center",
};

const TEXTS = {
  TITLE: "Details",
  CLEAR_DRAFT: "Clear Draft",
  SUBMIT: "Submit",
  BACK: "Back",
  UPLOAD_PHOTO: "Upload Photo",
  OFFICE_LOCATION: "Search Office Location...",
  NOTES: "Notes",
};

const LOCATIONS_ENDPOINT = `${import.meta.env.VITE_DETAILS_SERVICE_PORT}/locations`;

const EMPLOYMENT_TYPE_OPTIONS: { label: string; value: EmploymentType }[] = [
  {
    label: "Full-time",
    value: EmploymentType.FULL_TIME,
  },
  {
    label: "Part-time",
    value: EmploymentType.PART_TIME,
  },
  {
    label: "Contract",
    value: EmploymentType.CONTRACT,
  },
  {
    label: "Intern",
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
    required: false,
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
    handleChangeFormData,
  } = useForm<Details>(LS_OPS_FORM_KEY, OPS_VALIDATION_SCHEMA);

  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleEmploymentTypeChange = useCallback((value: string | number) => {
    handleChangeFormData({
      name: "employmentType",
      value: value,
    });
  }, []);

  const handleFileChange = useCallback((file: string | null) => {
    setFormData((prev) => ({
      ...prev,
      photo: file || undefined,
    }));
    validateAndTouch("photo", file || undefined);
  }, []);

  const handleOfficeLocationSelect = useCallback(
    (option: OfficeLocation | null) => {
      setFormData((prev) => ({
        ...prev,
        officeLocation: option || undefined,
      }));
      validateAndTouch("officeLocation", option || undefined);
    },
    [],
  );

  return (
    <>
      <div className={classes.container}>
        {canGoBack ? (
          <Button
            type="button"
            className={classes.backButton}
            onClick={() => router.history.back()}
          >
            {TEXTS.BACK}
          </Button>
        ) : null}

        <h2 className={classes.title}>{TEXTS.TITLE}</h2>
      </div>
      <FileInput
        name="photo"
        value={formData?.photo}
        placeholder={TEXTS.UPLOAD_PHOTO}
        onChange={handleFileChange}
        onBlur={() => handleBlur("photo")}
        errorMessage={touched.photo && errors.photo ? errors.photo : undefined}
      />
      <Select
        name="employmentType"
        options={EMPLOYMENT_TYPE_OPTIONS}
        value={formData?.employmentType}
        onChange={handleEmploymentTypeChange}
        onBlur={() => handleBlur("employmentType")}
        errorMessage={
          touched.employmentType && errors.employmentType
            ? errors.employmentType
            : undefined
        }
      />
      <Autocomplete
        name="officeLocation"
        placeholder={TEXTS.OFFICE_LOCATION}
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
        placeholder={TEXTS.NOTES}
        value={formData?.notes || ""}
        onChange={handleInputChange}
      />
      <div className={classes.buttonsContainer}>
        <Button
          type="button"
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
        >
          {TEXTS.CLEAR_DRAFT}
        </Button>
        <Button
          loading={isSyncing()}
          disabled={!isReadyToSubmit()}
          onClick={handleSubmit}
          type="button"
        >
          {TEXTS.SUBMIT}
        </Button>
      </div>
    </>
  );
};
