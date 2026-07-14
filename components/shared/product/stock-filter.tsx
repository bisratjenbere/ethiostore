import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StockFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function StockFilter({ checked, onChange }: StockFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm mb-3">Availability</h3>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={checked}
          onCheckedChange={(value) => onChange(value === true)}
        />
        <Label
          htmlFor="in-stock"
          className="text-sm font-normal cursor-pointer"
        >
          In Stock Only
        </Label>
      </div>
    </div>
  );
}
