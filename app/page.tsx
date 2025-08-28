import { Navigation } from "@/components/layout/navigation";
import { Hero } from "@/components/articles/hero";
import { LatestArticles } from "@/components/articles/latest-articles";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="grid gap-32">
      <Hero />
      <LatestArticles />
    </div>
  );
}
