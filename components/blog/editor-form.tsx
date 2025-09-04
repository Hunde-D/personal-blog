import type { PostCT } from "@/components/blog/types";
import {
  InputField,
  TextareaField,
  FormFieldGroup,
} from "@/components/ui/form-field";
import { PostCreateSchema, type PostCreateInput } from "./validation";
import { calculateReadTime } from "./validation";
import { sanitizeInput, validateAndSanitizeUrl } from "@/lib/form-utils";
import { useState, useEffect } from "react";
import { TagInput } from "./tag-input";
import { MarkdownRenderer } from "./markdown-renderer";

type EditorFormProps = {
  postData: PostCT;
  setPostData: (data: PostCT) => void;
  errors?: Record<string, string>;
  onValidationChange?: (isValid: boolean) => void;
};

export const EditorForm = ({
  postData,
  setPostData,
  errors = {},
  onValidationChange,
}: EditorFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [viewMode, setViewMode] = useState<"write" | "preview">("write");
  const [slugEdited, setSlugEdited] = useState(false);

  // Validate form data in real-time
  useEffect(() => {
    try {
      PostCreateSchema.parse({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt || "",
        published: postData.published || false,
      });
      setValidationErrors({});
      onValidationChange?.(true);
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          if (field) {
            formattedErrors[field] = err.message;
          }
        });
        setValidationErrors(formattedErrors);
        onValidationChange?.(false);
      }
    }
  }, [
    postData.title,
    postData.content,
    postData.excerpt,
    postData.published,
    onValidationChange,
  ]);

  const handleChange = (
    field: keyof PostCT,
    value: string | boolean | Array<{ id?: string; name: string }>,
  ) => {
    // Do not sanitize markdown content; preserve symbols and whitespace
    if (field === "content") {
      setPostData({ ...postData, [field]: value as string });
      return;
    }

    // If user edits slug manually, stop auto-sync
    if (field === ("slug" as keyof PostCT)) {
      setSlugEdited(true);
    }

    // Allow spaces and markdown characters in inputs; defer sanitization to server or submit-time
    setPostData({ ...postData, [field]: value as any });
  };

  const handleUrlChange = (field: keyof PostCT, value: string) => {
    if (field === "coverImage") {
      const sanitizedUrl = validateAndSanitizeUrl(value);
      setPostData({ ...postData, [field]: sanitizedUrl });
    } else {
      handleChange(field, value);
    }
  };

  const readTime = calculateReadTime(postData.content);
  const wordCount = postData.content.split(/\s+/).filter(Boolean).length;

  // Auto-generate slug from title if user hasn't edited slug manually
  useEffect(() => {
    // Keep slug in sync with title unless user edited slug manually
    if (slugEdited) return;
    const auto = (postData.title || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setPostData({ ...postData, slug: auto });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData.title, slugEdited]);

  return (
    <div className="space-y-6 p-5">
      <FormFieldGroup
        title="Post Details"
        description="Basic information about your blog post"
      >
        <InputField
          label="Title"
          placeholder="Enter your blog post title..."
          value={postData.title}
          onChange={(value) => handleChange("title", value)}
          error={errors.title || validationErrors.title}
          required
          maxLength={100}
        />

        <InputField
          label="Slug"
          placeholder="auto-generated-from-title"
          value={postData.slug || ""}
          onChange={(value) => handleChange("slug" as any, value)}
          error={errors.slug || validationErrors.slug}
          maxLength={120}
        />

        <InputField
          label="Excerpt"
          placeholder="Write a brief excerpt..."
          value={postData.excerpt || ""}
          onChange={(value) => handleChange("excerpt", value)}
          error={errors.excerpt || validationErrors.excerpt}
          maxLength={300}
        />

        <InputField
          label="Cover Image URL"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={postData.coverImage || ""}
          onChange={(value) => handleUrlChange("coverImage", value)}
          error={errors.coverImage || validationErrors.coverImage}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Tags
          </label>
          <TagInput
            tags={postData.tags || []}
            onTagsChange={(tags) => handleChange("tags", tags)}
            placeholder="Add tags to categorize your post..."
            maxTags={10}
          />
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        title="Content"
        description="Write your blog post content (supports markdown)"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">Editor</div>
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              className={`px-3 py-1 text-sm ${viewMode === "write" ? "bg-accent text-accent-foreground" : "bg-background"}`}
              onClick={() => setViewMode("write")}
            >
              Write
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm border-l border-border ${viewMode === "preview" ? "bg-accent text-accent-foreground" : "bg-background"}`}
              onClick={() => setViewMode("preview")}
            >
              Preview
            </button>
          </div>
        </div>

        {viewMode === "write" ? (
          <TextareaField
            placeholder="Write your blog post content..."
            value={postData.content}
            onChange={(value) => handleChange("content", value)}
            error={errors.content || validationErrors.content}
            required
            rows={20}
            maxLength={10000}
            className="font-mono text-sm resize-none"
          />
        ) : (
          <div className="rounded-md border border-border p-4 bg-card min-h-[240px]">
            <MarkdownRenderer content={postData.content || ""} />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Word count: {wordCount}</span>
          <span>Estimated read time: {readTime} min</span>
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        title="Publishing"
        description="Control when and how your post is published"
      >
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={postData.published || false}
            onChange={(e) => handleChange("published", e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish immediately
          </label>
        </div>

        {postData.published && (
          <p className="text-sm text-muted-foreground">
            This post will be visible to all users once saved.
          </p>
        )}
      </FormFieldGroup>
    </div>
  );
};
