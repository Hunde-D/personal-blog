import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/blog-post";
import { api } from "@/trpc/server";

type Params = Promise<{ slug: string }>;

export const generateMetadata = async (props: {
  params: Params;
}): Promise<Metadata> => {
  const params = await props.params;
  const slug = params.slug;
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

const BlogPostPage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const post = await api.post.find({ slug });
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
};

export default BlogPostPage;
