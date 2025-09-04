"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import {
  InputField,
  CheckboxField,
  FormFieldGroup,
} from "@/components/ui/form-field";
import { SignUpSchema, type SignUpInput } from "@/lib/auth-validation";
import { formatValidationErrors } from "@/lib/form-utils";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { validatePassword } from "@/lib/auth-validation";

export default function SignUpModal() {
  const id = useId();
  const [form, setForm] = useState<SignUpInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });

  const handleChange = (field: keyof SignUpInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate password strength in real-time
    if (field === "password") {
      const strength = validatePassword(value);
      setPasswordStrength(strength);
    }
  };

  const validateForm = (): boolean => {
    try {
      SignUpSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const validationErrors = formatValidationErrors(error as any);
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const { data, error } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      if (error) {
        setErrors({ form: error.message || "Sign up failed" });
      } else {
        setSuccess(true);
        // Close modal or redirect after successful sign up
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err: any) {
      setErrors({ form: err.message || "Sign up failed" });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (form.password.length === 0) return "text-muted-foreground";
    if (passwordStrength.isValid) return "text-green-600";
    if (form.password.length >= 8) return "text-yellow-600";
    return "text-red-600";
  };

  const getPasswordStrengthText = () => {
    if (form.password.length === 0) return "Enter a password";
    if (passwordStrength.isValid) return "Strong password";
    if (form.password.length >= 8) return "Moderate password";
    return "Weak password";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign up</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <img src="/logo.webp" alt="logo" className="h-8 w-8 rounded-full" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Create an account
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your details to create your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormFieldGroup>
            <InputField
              id={`${id}-name`}
              label="Full Name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(value) => handleChange("name", value)}
              error={errors.name}
              required
              disabled={loading}
              autoComplete="name"
            />

            <InputField
              id={`${id}-email`}
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={(value) => handleChange("email", value)}
              error={errors.email}
              required
              disabled={loading}
              autoComplete="email"
            />

            <InputField
              id={`${id}-password`}
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(value) => handleChange("password", value)}
              error={errors.password}
              required
              disabled={loading}
              autoComplete="new-password"
            />

            {form.password && (
              <div className="space-y-2">
                <p className={`text-sm ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthText()}
                </p>
                {!passwordStrength.isValid &&
                  passwordStrength.errors.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {passwordStrength.errors.map((error, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <span className="text-destructive">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

            <InputField
              id={`${id}-confirmPassword`}
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(value) => handleChange("confirmPassword", value)}
              error={errors.confirmPassword}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </FormFieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          {errors.form && (
            <p className="text-destructive text-sm text-center">
              {errors.form}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">
              Account created successfully! Redirecting...
            </p>
          )}
        </form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button variant="outline" disabled={loading} className="w-full">
          Sign up with Google
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => {
              // Close this modal and open sign in modal
              // This would need to be handled by parent component
            }}
          >
            Sign in
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
