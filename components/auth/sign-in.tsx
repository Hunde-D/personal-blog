"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { InputField } from "@/components/ui/form-field";
import { SignInSchema, type SignInInput } from "@/lib/auth-validation";
import { formatValidationErrors } from "@/lib/form-utils";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { BookMarked } from "lucide-react";

export default function SigninModal({
  children,
  callback,
}: {
  children: React.ReactNode;
  callback?: () => void;
}) {
  const id = useId();
  const router = useRouter();
  const [form, setForm] = useState<SignInInput>({
    email: "",
    password: "",
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
        const message = error.message || "Sign in failed";
        setErrors({ form: message });
        toast.error(message);
      } else {
        setSuccess(true);
        callback?.();
        toast.success("Signed in successfully");
        router.push("/");
      }
    } catch (err: any) {
      const message = err.message || "Sign in failed";
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <BookMarked />
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
          <div>
            <p>Demo Credential</p>
            <p>Email: hunde.ddh@gmail.com</p>
            <p>Password: hundepass</p>
          </div>

          {errors.form && (
            <p className="text-destructive text-sm text-center">
              {errors.form}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
