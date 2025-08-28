import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/components/blog/blog-post";
import { PostCT } from "./types";

export function Preview({ post }: { post: PostCT }) {
  return (
    <Card>
      <CardHeader>
        <Badge>Preview</Badge>
      </CardHeader>
      <CardContent>
        <BlogPost testPost={post} preview={true} />
      </CardContent>
    </Card>
  );
}
