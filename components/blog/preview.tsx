import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/components/blog/blog-post";
import type { BlogPostType } from "@/components/blog/types";

export function Preview({ post }: { post: BlogPostType }) {
  return (
    <Card>
      <CardHeader>
        <Badge>Preview</Badge>
      </CardHeader>
      <CardContent>
        <BlogPost post={post} />
      </CardContent>
    </Card>
  );
}
