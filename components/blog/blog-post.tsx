import type { BlogPostType } from "@/components/blog/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownRenderer } from "./markdown-renderer";

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance">
          {post.title}
        </h1>
        <time className="text-muted-foreground italic text-sm sm:text-base">
          Published{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <MarkdownRenderer content={post.content} />
      {/* <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border">
        <p className="text-muted-foreground text-sm sm:text-base">
          Thanks for reading, and I'll catch you in the next post!
        </p>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          — Hunde Desalegn
        </p>
      </div> */}
    </article>
  );
}
