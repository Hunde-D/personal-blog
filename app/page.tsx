import { LatestPost } from "@/components/post";
import { api, HydrateClient } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  const hello = await api.post.hello({ text: "route" });
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>

        <LatestPost />
      </div>
    </HydrateClient>
  );
}
