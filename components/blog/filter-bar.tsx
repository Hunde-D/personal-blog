"use client";

import { Search, Filter, X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagFilter } from "./tag-filter";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: Array<{ id?: string; name: string }>;
  onTagsChange: (tags: Array<{ id?: string; name: string }>) => void;
  status: "all" | "published" | "draft";
  onStatusChange: (status: "all" | "published" | "draft") => void;
  className?: string;
  showStatusFilter?: boolean;
  showTagFilter?: boolean;
  placeholder?: string;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  status,
  onStatusChange,
  className,
  showStatusFilter = true,
  showTagFilter = true,
  placeholder = "Search posts...",
}: FilterBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 100);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const hasActiveFilters =
    searchTerm || selectedTags.length > 0 || status !== "all";

  const clearAllFilters = () => {
    setLocalSearchTerm("");
    onSearchChange("");
    onTagsChange([]);
    onStatusChange("all");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {showStatusFilter && (
          <Select
            value={status}
            onValueChange={(value: "all" | "published" | "draft") =>
              onStatusChange(value)
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showTagFilter && (
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          placeholder="Filter by tags..."
        />
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />"{searchTerm}"
              <button
                onClick={() => {
                  setLocalSearchTerm("");
                  onSearchChange("");
                }}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {status === "published" ? "Published" : "Drafts"}
              <button
                onClick={() => onStatusChange("all")}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id ?? tag.name}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span>#{tag.name}</span>
              <button
                onClick={() =>
                  onTagsChange(selectedTags.filter((t) => t.name !== tag.name))
                }
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
