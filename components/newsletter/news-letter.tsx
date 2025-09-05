"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Subscribed! Check your inbox for confirmation.");
      setEmail("");
      inputRef.current?.blur();
    } catch (err) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-balance">
        Stay Updated
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
        Subscribe to my newsletter to get the latest blog posts, coding tips,
        and insights delivered straight to your inbox. No spam, just valuable
        content for your development journey.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              ref={inputRef}
              type="email"
              placeholder="Enter your email address"
              className="w-full text-base"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4">
          You can unsubscribe at any time. No spam, ever.
        </p>
      </div>

      <div className="mt-8 sm:mt-12 text-left">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          What you'll get:
        </h2>
        <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Weekly coding tips and best practices</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>New blog post notifications</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Exclusive content and behind-the-scenes insights</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 mt-1">✓</span>
            <span>Resources and tools I'm currently using</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
