"use client";
import { useState } from "react";
import { Preview } from "@/components/blog/preview";
import type { PostCT, PostT } from "@/components/blog/types";
import { useEditorActions } from "@/hooks/use-editor-actions";
import { EditorActions } from "./editor-actions";
import { EditorForm } from "./editor-form";

type EditorClientProps = {
  foundPost?: PostT | null;
  edit?: boolean;
};
export const EditorClient = ({
  foundPost,
  edit = false,
}: EditorClientProps) => {
  const [postData, setPostData] = useState<PostCT>(
    foundPost ? {
      title: foundPost.title,
      content: foundPost.content,
      excerpt: foundPost.excerpt || "",
      published: foundPost.published,
      coverImage: foundPost.coverImage,
      tags: foundPost.tags || [],
    } : {
      title: "Untitled Post",
      content: "",
      excerpt: "",
      published: false,
      tags: [],
    },
  );
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const { createPost, mutatePost } = useEditorActions();

  const handleSave = async () => {
    if (edit) {
      if (!foundPost?.id) {
        alert("Post not found for updating.");
        return;
      }
      mutatePost.mutate({ id: foundPost.id, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-6">
        <EditorForm postData={postData} setPostData={setPostData} />
        <EditorActions
          isPreview={isPreview}
          togglePreview={() => setIsPreview(!isPreview)}
          handleSave={handleSave}
          isSaving={edit ? mutatePost.isPending : createPost.isPending}
        />
      </div>
      <div>{isPreview && <Preview post={postData} />}</div>
    </div>
  );
};
