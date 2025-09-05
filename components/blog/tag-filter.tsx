"use client";

import { X, Tag, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

type TagOption = { id: string; name: string; postCount?: number };

interface TagFilterProps {
  selectedTags: Array<{ id?: string; name: string }>;
  onTagsChange: (tags: Array<{ id?: string; name: string }>) => void;
  className?: string;
  placeholder?: string;
  showCount?: boolean;
}

export const TagFilter = ({
  selectedTags,
  onTagsChange,
  className,
  placeholder = "Filter by tags...",
  showCount = true,
}: TagFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: tags = [], isLoading } = api.post.getTags.useQuery();

  const filteredTags: TagOption[] = (tags as TagOption[]).filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagToggle = (tag: { id: string; name: string }) => {
    if (selectedTags.some((t) => t.name === tag.name)) {
      onTagsChange(selectedTags.filter((t) => t.name !== tag.name));
    } else {
      onTagsChange([...selectedTags, { id: tag.id, name: tag.name }]);
    }
    setIsOpen(false);
  };

  const handleRemoveTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t.name !== tagName));
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <div className={cn("relative", className)}>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id ?? tag.name}
              variant="secondary"
              className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
              onClick={() => handleRemoveTag(tag.name)}
            >
              <Tag className="h-3 w-3" />
              {tag.name}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between",
            selectedTags.length > 0 && "border-primary text-primary"
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="truncate">
              {selectedTags.length > 0
                ? `${selectedTags.length} tag${
                    selectedTags.length === 1 ? "" : "s"
                  } selected`
                : placeholder}
            </span>
          </div>
        </Button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-hidden"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-3 border-b border-border">
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Loading tags...
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  {searchTerm ? "No tags found" : "No tags available"}
                </div>
              ) : (
                <div className="p-2">
                  {filteredTags.map((tag: TagOption) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                        selectedTags.some((t) => t.name === tag.name) &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          {tag.name}
                        </span>
                        {showCount && (
                          <Badge variant="secondary" className="text-xs">
                            {tag.postCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
