import React from "react";
import { BlogPost } from "@/components/blog/blog-post";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogStatusBadge } from "./blog-status-badge";
import type { PostCT } from "./types";
export function Preview({ post }: { post: PostCT }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Badge className="p-2 rounded-full">Preview</Badge>
          <BlogStatusBadge published={post.published} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BlogPost testPost={post} preview={true} />
      </CardContent>
    </Card>
  );
}
