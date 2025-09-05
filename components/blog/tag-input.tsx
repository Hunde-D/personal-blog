"use client";

import { X, Plus, Tag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

type TagOption = { id: string; name: string; postCount?: number };

interface TagInputProps {
  tags: Array<{ id?: string; name: string }>;
  onTagsChange: (tags: Array<{ id?: string; name: string }>) => void;
  className?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

export const TagInput = ({
  tags,
  onTagsChange,
  className,
  placeholder = "Add tags...",
  maxTags = 10,
  disabled = false,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: existingTagsData = [] } = api.post.getTags.useQuery();
  const existingTags: TagOption[] = existingTagsData as TagOption[];

  const handleAddTag = (tag: string | { id: string; name: string }) => {
    const fromSuggestion = typeof tag !== "string";
    const rawName = typeof tag === "string" ? tag : tag.name;
    const trimmed = rawName.trim();

    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    if (tags.some((t) => t.name.toLowerCase() === lower)) {
      setInputValue("");
      return;
    }

    if (tags.length >= maxTags) {
      return;
    }

    const existing = fromSuggestion
      ? (tag as { id: string; name: string })
      : existingTags.find((t: TagOption) => t.name.toLowerCase() === lower);

    if (existing) {
      onTagsChange([...tags, { id: existing.id, name: existing.name }]);
      setInputValue("");
      return;
    }

    onTagsChange([...tags, { name: trimmed }]);
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag.name !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1].name);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      handleAddTag(inputValue);
    }
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const availableTags = existingTags
    .filter((tag: TagOption) => !tags.some((t) => t.name === tag.name))
    .slice(0, 8);

  return (
    <div className={cn("space-y-3", className)}>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.name}
              variant="secondary"
              className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
              onClick={() => !disabled && handleRemoveTag(tag.name)}
            >
              <Tag className="h-3 w-3" />
              {tag.name}
              {!disabled && <X className="h-3 w-3" />}
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          placeholder={
            tags.length >= maxTags ? "Maximum tags reached" : placeholder
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled || tags.length >= maxTags}
          className="pr-20"
        />

        {inputValue.trim() && (
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddTag(inputValue)}
            disabled={disabled || tags.length >= maxTags}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isInputFocused && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {availableTags
            .filter((tag: TagOption) =>
              inputValue
                ? tag.name.toLowerCase().includes(inputValue.toLowerCase())
                : true
            )
            .map((tag: TagOption) => (
              <button
                key={tag.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddTag({ id: tag.id, name: tag.name });
                }}
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  <span>{tag.name}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {tag.postCount}
                  </Badge>
                </div>
              </button>
            ))}
          {inputValue.trim() &&
            !existingTags.some(
              (t) => t.name.toLowerCase() === inputValue.trim().toLowerCase()
            ) && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddTag(inputValue);
                }}
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm transition-colors border-t border-border"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-3 w-3" />
                  <span>Create tag "{inputValue.trim()}"</span>
                </div>
              </button>
            )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add tags. Maximum {maxTags} tags allowed.
      </p>
    </div>
  );
};
