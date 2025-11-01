import { Button, ButtonVariant } from "../Button";
import { Input } from "../Input";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { FileInput } from "../FileInput";
import { useState, useCallback, useRef } from "react";
import { useSearch } from "@tanstack/react-router";
import { LinkButton } from "../LinkButton";

export const EmploymentType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERN: "intern",
} as const;

interface Details {
  employmentType: EmploymentType;
  officeLocation: string;
  notes: string;
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

const INITIAL_FORM_STATE: Partial<Details> = {
  employmentType: EmploymentType.FULL_TIME,
  officeLocation: "",
  notes: "",
};

export const Step2Form = () => {
  const search = useSearch({ from: "/wizard" });
  const currentRole = search.role || "ops";

  const [formData, setFormData] =
    useState<Partial<Details>>(INITIAL_FORM_STATE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isInitialLoadRef = useRef(true);

  const handleClearDraft = () => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedFile(null);
    isInitialLoadRef.current = true;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleEmploymentTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        employmentType: e.target.value as EmploymentType,
      }));
    },
    [],
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, notes: e.target.value }));
    },
    [],
  );

  const handleFileChange = useCallback((file: File | null) => {
    setSelectedFile(file);
  }, []);

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
        placeholder="Upload Photo"
        onChange={handleFileChange}
      />
      <Select
        name="employmentType"
        options={EMPLOYMENT_TYPE_OPTIONS}
        value={formData.employmentType}
        onChange={handleEmploymentTypeChange}
      />
      <Input
        name="officeLocation"
        type="text"
        placeholder="Office Location"
        value={formData.officeLocation || ""}
        onChange={handleInputChange}
      />
      <TextArea
        name="notes"
        placeholder="Notes"
        value={formData.notes || ""}
        onChange={handleNotesChange}
      />
      <div className="flex gap-2 justify-center">
        <Button
          variant={ButtonVariant.ORANGE}
          onClick={handleClearDraft}
          type="button"
        >
          Clear Draft
        </Button>
        <Button>Submit</Button>
      </div>
    </>
  );
};
