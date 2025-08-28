import { Navigation } from "@/components/layout/navigation";
import { Hero } from "@/components/blog/hero";
import { LatestArticles } from "@/components/blog/latest-articles";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="grid gap-32">
      <Hero />
      <LatestArticles />
    </div>
  );
}
