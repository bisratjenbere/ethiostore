import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  claseName,
}: {
  value: number;
  claseName?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [int, decimal] = stringValue.split(".");
  return (
    <p className={cn(claseName)}>
      <span className="text-xs align-super">$</span>
      {int}
      <span className="text-xs align-super">{decimal}</span>
    </p>
  );
};

export default ProductPrice;
