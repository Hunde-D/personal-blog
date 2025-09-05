import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "@/components/blog/blog-list";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { api, HydrateClient } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Blogs - Hunde's Blogs",
  description: "Read the latest articles and insights on coding and technology",
};

export const dynamic = "force-dynamic";

const BlogPage = async () => {
  // Prefetch the first page of published posts
  void api.post.listPublished.prefetchInfinite({
    limit: 10,
    query: undefined,
  });
  return (
    <HydrateClient>
      <div className="">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-3xl font-bold">Latest Blogs</h1>
          <div className="h-1 w-12 bg-primary"></div>
        </div>
        <Suspense
          fallback={
            <div className="w-56 h-20 flex flex-col justify-center items-center gap-4">
              <ClassicLoader />
            </div>
          }
        >
          <BlogList />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default BlogPage;
