import { Suspense } from "react";
import { Hero } from "@/components/blog/hero";
import { LatestArticles } from "@/components/blog/latest-articles";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { api, HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "Hunde's Blog",
  description: "A blog about programming, technology, and more.",
};
export const dynamic = "force-dynamic";
export default function HomePage() {
  void api.post.listPublished.prefetchInfinite({
    limit: 10,
    query: undefined,
  });
  return (
    <HydrateClient>
      <div className="grid gap-32">
        <Hero />
        <section>
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Latest Articles</h2>
            <div className="h-1 w-8 sm:w-12 bg-primary"></div>
          </div>
          <Suspense
            fallback={
              <div className="w-56 h-20 flex flex-col justify-center items-center gap-4">
                <ClassicLoader />
              </div>
            }
          >
            <LatestArticles />
          </Suspense>
        </section>
      </div>
    </HydrateClient>
  );
}
