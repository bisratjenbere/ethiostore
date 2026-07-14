import FilterItem from "./filter-item";
import type { BrandCount } from "@/lib/actions/product.actions";

interface BrandFilterProps {
  brands: BrandCount[];
  selected?: string;
  onChange: (brand: string | null) => void;
}

export default function BrandFilter({
  brands,
  selected,
  onChange,
}: BrandFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Brand</h3>
      <div className="space-y-1">
        <FilterItem
          label="All Brands"
          value="all"
          selected={!selected || selected === "all"}
          onClick={() => onChange(null)}
        />
        {brands.map((brand) => (
          <FilterItem
            key={brand.brand}
            label={brand.brand}
            value={brand.brand}
            count={brand.count}
            selected={selected === brand.brand}
            onClick={() => onChange(brand.brand)}
          />
        ))}
      </div>
    </div>
  );
}
