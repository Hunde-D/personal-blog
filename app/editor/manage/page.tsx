import { ManagePost } from "@/components/blog/manage-post";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Manage Posts - Hunde's Blog",
  description: "Administer your blog posts",
};
const ManagePostsPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  void api.post.listAll.prefetchInfinite({
    limit: 10,
    query: searchParams.query as string | undefined,
  });

  return (
    <HydrateClient>
      <Suspense>
        <ManagePost />
      </Suspense>
    </HydrateClient>
  );
};

export default ManagePostsPage;
