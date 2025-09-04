import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";

export const useFindPost = (find: string = "edit") => {
  const searchParams = useSearchParams();
  const slug = searchParams.get(find) || undefined;
  const query = api.post.find.useQuery(
    { slug: slug! },
    {
      enabled: !!slug,
    },
  );
  return { ...query, slug };
};
