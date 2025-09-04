import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EditorClient } from "@/components/blog/editor-client";
import { Button } from "@/components/ui/button";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const generateMetadata = async (props: {
  searchParams: SearchParams;
}): Promise<Metadata> => {
  const searchParams = await props.searchParams;
  const slug = searchParams.edit as string | undefined;
  if (slug) {
    const post = await api.post.find({ slug });
    if (!post) {
      return {
        title: "Post Not Found",
      };
    }
    return {
      title: post.title,
      description: post.excerpt,
    };
  }
  return {
    title: "Create New Post - Hunde's Blog",
    description: "Create and edit your blog posts",
  };
};

const EditorPage = async (props: { searchParams: SearchParams }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
  const searchParams = await props.searchParams;
  const slug = (searchParams.edit as string) ?? null;

  let foundPost = null;
  if (slug) {
    foundPost = await api.post.find({ slug });
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {slug ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-muted-foreground">
            {slug ? "Edit" : "Create and publish"} your blog posts
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/editor/manage">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Manage Posts
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<ClassicLoader />}>
        <EditorClient />
      </Suspense>
    </>
  );
};

export default EditorPage;
