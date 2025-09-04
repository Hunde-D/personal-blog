import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownRenderer } from "./markdown-renderer";
import type { PostCT, PostT } from "./types";

interface BlogPostProps {
  post?: PostT;
  testPost?: PostCT;
  preview?: boolean;
}

export function BlogPost({ post, preview = false, testPost }: BlogPostProps) {
  if (preview && testPost) {
    post = {
      id: "preview",
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: "preview",
      authorId: "preview",
      publishedAt: new Date(),
      readTimeMin: null,
      title: testPost.title,
      content: testPost.content,
      excerpt: testPost.excerpt,
      published: testPost.published,
      coverImage: testPost.coverImage,
      tags: testPost.tags,
    } as PostT;
  }
  return (
    <article className="">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance">
          {post?.title}
        </h1>
        <time className="text-muted-foreground italic text-sm sm:text-base">
          Published {post?.publishedAt?.toDateString()}
        </time>
      </div>
      <MarkdownRenderer content={post?.content ?? ""} />
    </article>
  );
}
