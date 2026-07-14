import FilterItem from "./filter-item";
import type { CategoryCount } from "@/lib/actions/product.actions";

interface CategoryFilterProps {
  categories: CategoryCount[];
  selected?: string;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Category</h3>
      <div className="space-y-1">
        <FilterItem
          label="All Categories"
          value="all"
          selected={!selected || selected === "all"}
          onClick={() => onChange(null)}
        />
        {categories.map((cat) => (
          <FilterItem
            key={cat.category}
            label={cat.category}
            value={cat.category}
            count={cat.count}
            selected={selected === cat.category}
            onClick={() => onChange(cat.category)}
          />
        ))}
      </div>
    </div>
  );
}
