"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { AlertCircle } from "lucide-react";

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  id?: string;
  type?: "text" | "email" | "password" | "url" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  autoComplete?: string;
  maxLength?: number;
}

interface TextareaFieldProps extends BaseFieldProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  maxLength?: number;
}

interface CheckboxFieldProps extends BaseFieldProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  description?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  id?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// Input Field Component
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, required, className, type = "text", ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            type={type}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              "transition-colors",
            )}
            value={props.value}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            maxLength={props.maxLength}
            disabled={props.disabled}
            onBlur={props.onBlur}
            onChange={(e) => props.onChange?.(e.target.value)}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
InputField.displayName = "InputField";

// Textarea Field Component
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, error, required, className, ...props }, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Textarea
          ref={ref}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "transition-colors",
          )}
          value={props.value}
          placeholder={props.placeholder}
          rows={props.rows}
          maxLength={props.maxLength}
          disabled={props.disabled}
          onBlur={props.onBlur}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
});
TextareaField.displayName = "TextareaField";

// Checkbox Field Component
export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ label, error, required, className, description, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-start space-x-2">
          <Checkbox
            ref={ref}
            className={cn(error && "border-destructive", "mt-1")}
            checked={props.checked}
            disabled={props.disabled}
            onCheckedChange={props.onChange}
          />
          <div className="space-y-1">
            {label && (
              <Label className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
CheckboxField.displayName = "CheckboxField";

// Select Field Component
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, error, required, className, options, placeholder, ...props },
    ref,
  ) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              "transition-colors",
            )}
            value={props.value}
            disabled={props.disabled}
            onChange={(e) => props.onChange?.(e.target.value)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
SelectField.displayName = "SelectField";

// Form Field Group Component
interface FormFieldGroupProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const FormFieldGroup = ({
  children,
  className,
  title,
  description,
}: FormFieldGroupProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions = ({ children, className }: FormActionsProps) => {
  return (
    <div
      className={cn("flex items-center justify-end space-x-2 pt-4", className)}
    >
      {children}
    </div>
  );
};
