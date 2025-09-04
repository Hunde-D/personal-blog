import { Suspense } from "react";
import { ManagePost, ManagePostHeader } from "@/components/blog/manage-post";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { api, HydrateClient } from "@/trpc/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Manage Posts - Hunde's Blog",
  description: "Administer your blog posts",
};
const ManagePostsPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  // Prefetch the first page of all posts for management
  await api.post.list.prefetchInfinite({
    limit: 10,
    query: searchParams.query as string | undefined,
  });

  return (
    <HydrateClient>
      <div>
        <ManagePostHeader />
        <Suspense fallback={<ClassicLoader />}>
          <ManagePost />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default ManagePostsPage;
