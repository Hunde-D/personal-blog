"use client";

import {
  LogOut,
  User,
  Settings,
  Mail,
  Calendar,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SigninModal from "../auth/sign-in";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const checkAuthState = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check auth state:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(checkAuthState, 5000);
    const handleFocus = () => checkAuthState();

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchUser]);

  useEffect(() => {
    if (pathname.startsWith("/editor") && !user && !isLoading) {
      fetchUser();
    }
  }, [pathname, user, isLoading, fetchUser]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/newsletter", label: "Newsletter" },
  ];

  return (
    <nav className="border rounded-md p-0.5 max-sm:mx-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            className="size-12 rounded-md ring-2 ring-border hover:ring-primary hover:cursor-pointer transition-all"
            onClick={() => setIsProfileDialogOpen(true)}
          >
            <AvatarImage src={user?.image} />
            <AvatarFallback className="text-primary">
              {isLoading ? (
                <div className="animate-pulse bg-muted rounded-full w-6 h-6" />
              ) : (
                user?.name?.charAt(0) || "HD"
              )}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors text-sm lg:text-base",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}

          {isLoading ? (
            <div className="flex items-center gap-4">
              <Separator orientation="vertical" />
              <div className="flex items-center gap-4">
                <div className="animate-pulse bg-muted rounded w-20 h-4" />
                <div className="animate-pulse bg-muted rounded w-16 h-4" />
              </div>
            </div>
          ) : user ? (
            <OwnerNav closeMenu={() => {}} pathname={pathname} />
          ) : (
            <SigninModal>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Continue as Admin
              </Button>
            </SigninModal>
          )}

          <ModeToggle />
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border">
          <div className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors",
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <OwnerNav
                closeMenu={() => setIsMenuOpen(false)}
                pathname={pathname}
              />
            )}
          </div>
        </div>
      )}

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {user ? "User Profile" : "Welcome"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="size-20 ring-4 ring-primary/20 hover:cursor-pointer">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-2xl font-bold text-primary">
                  {user?.name?.charAt(0) || "HD"}
                </AvatarFallback>
              </Avatar>

              {user ? (
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Member since {new Date().getFullYear()}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Personal Blog</h3>
                  <p className="text-sm text-muted-foreground">
                    Welcome to my personal blog and portfolio
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              {user ? (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-center text-muted-foreground">
                      Admin Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsProfileDialogOpen(false);
                          router.push("/editor/manage");
                        }}
                        className="w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Posts
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsProfileDialogOpen(false);
                          router.push("/editor");
                        }}
                        className="w-full"
                      >
                        <User className="mr-2 h-4 w-4" />
                        New Post
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      setIsProfileDialogOpen(false);
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/");
                          },
                        },
                      });
                    }}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-center text-muted-foreground">
                      About This Blog
                    </h4>
                    <p className="text-xs text-muted-foreground text-center">
                      A personal blog where I share thoughts, experiences, and
                      insights about technology, life, and everything in
                      between.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-center text-muted-foreground">
                      Admin Access
                    </h4>
                    <SigninModal callback={() => setIsProfileDialogOpen(false)}>
                      <Button className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        Continue as Admin
                      </Button>
                    </SigninModal>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-center text-muted-foreground">
                      More About Me
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsProfileDialogOpen(false);
                          router.push("/about");
                        }}
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        About Page
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsProfileDialogOpen(false);
                          router.push("/newsletter");
                        }}
                        className="flex-1"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Newsletter
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

const OwnerNav = ({
  closeMenu,
  pathname,
}: {
  closeMenu: () => void;
  pathname: string;
}) => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const editorItems = [
    { href: "/editor/manage", label: "Manage Posts", icon: Settings },
    { href: "/editor", label: "New Post", icon: User },
  ];

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start">
      <Separator orientation="vertical" />
      {editorItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 transition-colors text-sm",
              pathname === item.href
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
            onClick={closeMenu}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="text-muted-foreground hover:text-destructive"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};
