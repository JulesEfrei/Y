import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortSelectProps {
  selectedSort: string;
  onChange: (sortOption: string) => void;
}

export function SortSelect({ selectedSort, onChange }: SortSelectProps) {
  return (
    <div className="max-w-xs">
      <Select
        value={selectedSort || "newest"}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="most_liked">Most Liked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
