"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className,
      )}
    />
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({
  className,
  lines = 3,
}: LoadingSkeletonProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded bg-muted",
            i === 0 ? "h-6 w-3/4" : i === 1 ? "h-4 w-1/2" : "h-4 w-full",
          )}
        />
      ))}
    </div>
  );
};

interface PostCardSkeletonProps {
  className?: string;
}

export const PostCardSkeleton = ({ className }: PostCardSkeletonProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    </div>
  );
};

interface PostListSkeletonProps {
  count?: number;
  className?: string;
}

export const PostListSkeleton = ({
  count = 3,
  className,
}: PostListSkeletonProps) => {
  return (
    <div className={cn("space-y-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
};

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  onClick?: () => void;
}

export const LoadingButton = ({
  children,
  loading = false,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  ...props
}: LoadingButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90":
            variant === "default",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground":
            variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80":
            variant === "secondary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "text-primary underline-offset-4 hover:underline": variant === "link",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90":
            variant === "destructive",
        },
        {
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-10 w-10": size === "icon",
        },
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};
