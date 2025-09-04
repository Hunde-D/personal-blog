import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EditorClient } from "@/components/blog/editor-client";
import { Button } from "@/components/ui/button";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { api } from "@/trpc/server";

type Params = Promise<{ edit: string }>;

export const generateMetadata = async (props: {
  params: Params;
}): Promise<Metadata> => {
  const params = await props.params;
  const slug = params.edit;
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
};

const EditorPage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.edit;

  let foundPost = null;
  if (slug) {
    foundPost = await api.post.find({ slug });
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Blog Post</h1>
          <p className="text-muted-foreground">Edit your blog posts</p>
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
        <EditorClient edit={true} foundPost={foundPost} />
      </Suspense>
    </>
  );
};

export default EditorPage;
