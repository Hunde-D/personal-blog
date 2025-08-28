import { BlogPost } from "@/components/blog/blog-post";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const generateMetadata = async ({ params }: BlogPostPageProps) => {
  const post = await api.post.find({ slug: params.slug });

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

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const post = await api.post.find({ slug: params.slug });
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
};

export default BlogPostPage;
