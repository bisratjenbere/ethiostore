import { cn } from "@/lib/utils";

interface FilterItemProps {
  label: string;
  value: string;
  count?: number;
  selected?: boolean;
  onClick: () => void;
}

export default function FilterItem({
  label,
  value,
  count,
  selected,
  onClick,
}: FilterItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent font-medium"
      )}
    >
      <div className="flex justify-between items-center">
        <span>{label}</span>
        {count !== undefined && (
          <span className="text-xs text-muted-foreground">({count})</span>
        )}
      </div>
    </button>
  );
}
