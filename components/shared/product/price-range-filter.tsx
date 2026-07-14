import FilterItem from "./filter-item";

interface PriceRangeFilterProps {
  currentMin?: string;
  currentMax?: string;
  onChange: (min: string | null, max: string | null) => void;
}

const priceRanges = [
  { label: "All Prices", min: null, max: null },
  { label: "Under $50", min: null, max: "50" },
  { label: "$50 - $100", min: "50", max: "100" },
  { label: "$100 - $200", min: "100", max: "200" },
  { label: "$200 - $500", min: "200", max: "500" },
  { label: "$500+", min: "500", max: null },
];

export default function PriceRangeFilter({
  currentMin,
  currentMax,
  onChange,
}: PriceRangeFilterProps) {
  const isSelected = (min: string | null, max: string | null) => {
    return currentMin === min && currentMax === max;
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Price Range</h3>
      <div className="space-y-1">
        {priceRanges.map((range) => (
          <FilterItem
            key={range.label}
            label={range.label}
            value={range.label}
            selected={isSelected(range.min, range.max)}
            onClick={() => onChange(range.min, range.max)}
          />
        ))}
      </div>
    </div>
  );
}
