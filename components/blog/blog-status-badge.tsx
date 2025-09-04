import { Pill, PillIndicator } from "../ui/pill";

export const BlogStatusBadge = ({ published }: { published: boolean }) => {
  return (
    <Pill>
      <PillIndicator pulse variant={published ? "success" : "warning"} />
      {published ? "Published" : "Draft"}
    </Pill>
  );
};
