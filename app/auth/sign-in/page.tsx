import SigninModal from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SigninPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Access your account to write, edit and manage posts.
          </p>
        </div>
        <SigninModal>
          <Button className="w-full">Sign in with email</Button>
        </SigninModal>

        <div className="text-sm">
          <Link href="/" className="underline hover:no-underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
