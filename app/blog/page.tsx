import { Suspense } from "react";
import { BlogList } from "@/components/blog/blog-list";
import { HydrateClient, api } from "@/trpc/server";

export const metadata = {
  title: "Blogs - Hunde's Blogs",
  description: "Read the latest articles and insights on coding and technology",
};
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const BlogPage = async (props: { searchParams: SearchParams }) => {
  void api.post.listPublished.prefetchInfinite({
    limit: 10,
    query: undefined,
  });
  return (
    <HydrateClient>
      <div className="">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-3xl font-bold">Latest Articles</h1>
          <div className="h-1 w-12 bg-primary"></div>
        </div>
        <Suspense>
          <BlogList />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default BlogPage;
