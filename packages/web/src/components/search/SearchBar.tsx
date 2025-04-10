import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyboardEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({
  placeholder = "Search prompts...",
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div
      className="relative w-full max-w-xl flex"
      suppressHydrationWarning={true}
    >
      <div className="relative flex-grow" suppressHydrationWarning={true}>
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          suppressHydrationWarning={true}
        >
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="search"
          className="pl-10 pr-16 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        type="button"
        className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        onClick={onSearch}
      >
        Search
      </Button>
    </div>
  );
}
