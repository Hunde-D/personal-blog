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
import { InputField, CheckboxField } from "@/components/ui/form-field";
import { SignInSchema, type SignInInput } from "@/lib/auth-validation";
import { formatValidationErrors } from "@/lib/form-utils";
import { LoadingSpinner } from "@/components/ui/loading-states";

export default function SigninModal() {
  const id = useId();
  const [form, setForm] = useState<SignInInput>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof SignInInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      SignInSchema.parse(form);
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
      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setErrors({ form: error.message || "Sign in failed" });
      } else {
        setSuccess(true);
        // Close modal or redirect after successful sign in
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      setErrors({ form: err.message || "Sign in failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <img src="/logo.webp" alt="logo" className="h-8 w-8 rounded-full" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(value) => handleChange("password", value)}
              error={errors.password}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-between gap-2">
            <CheckboxField
              id={`${id}-remember`}
              label="Remember me"
              checked={form.rememberMe}
              onChange={(checked) => handleChange("rememberMe", checked)}
            />
            <a className="text-sm underline hover:no-underline" href="#">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {errors.form && (
            <p className="text-destructive text-sm text-center">
              {errors.form}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">
              Sign in successful! Redirecting...
            </p>
          )}
        </form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button variant="outline" disabled={loading}>
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
