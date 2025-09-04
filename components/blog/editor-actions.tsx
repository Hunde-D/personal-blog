import { Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditorActionsProps = {
  isPreview: boolean;
  togglePreview: () => void;
  handleSave: () => void;
  isSaving: boolean;
};

export const EditorActions = ({
  isPreview,
  togglePreview,
  handleSave,
  isSaving,
}: EditorActionsProps) => (
  <div className="flex gap-3 pt-4">
    <Button
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center gap-2"
    >
      <Save className="w-4 h-4" />
      {isSaving ? "Saving..." : "Save"}
    </Button>
    <Button
      onClick={togglePreview}
      className="flex items-center gap-2 bg-secondary text-secondary-foreground"
    >
      <Eye className="w-4 h-4" />
      {isPreview ? "Hide Preview" : "Show Preview"}
    </Button>
  </div>
);
