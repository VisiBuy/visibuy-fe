import React from "react";
import PhoneInput, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "@/shared/components/ui/PhoneInputField.css";
import { cn } from "@/shared/utils/cn";

/**
 * E.164 is the standard format: +[country code][number], e.g. +2348012345678.
 * This component always emits E.164 via onChange so the backend receives country code + number.
 */
export type PhoneValue = string | undefined;

export interface PhoneInputFieldProps {
  /** Current value in E.164 format (e.g. "+2348012345678"). */
  value?: PhoneValue;
  /** Called with E.164 value when the user changes the number or country. */
  onChange?: (value: PhoneValue) => void;
  /** Default country code (e.g. "NG" for Nigeria). */
  defaultCountry?: Country;
  placeholder?: string;
  disabled?: boolean;
  /** Optional class for the container to match form layout (e.g. height, border). */
  className?: string;
  /** Input id for label association. */
  id?: string;
}

/**
 * Reusable phone input with country selector and flags.
 * Integrates with Ant Design Form: use as Form.Item child; form values.phone will be E.164.
 */
function PhoneInputField({
  value,
  onChange,
  defaultCountry = "NG",
  placeholder = "Enter phone number",
  disabled = false,
  className,
  id,
}: PhoneInputFieldProps) {
  return (
    <PhoneInput
      id={id}
      international
      defaultCountry={defaultCountry}
      value={value ?? undefined}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn("PhoneInputField", className)}
      numberInputProps={{
        "data-testid": "phone-number-input",
        "aria-label": "Phone number",
      }}
    />
  );
}

export { PhoneInputField };
