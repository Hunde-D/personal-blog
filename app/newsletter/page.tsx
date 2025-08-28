import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Newsletter - Paulina's Blog",
  description:
    "Subscribe to get the latest posts and coding insights delivered to your inbox",
};

export default function NewsletterPage() {
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
        <form className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="w-full text-base"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Subscribe to Newsletter
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
}
