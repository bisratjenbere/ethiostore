import { checkOutSteps } from "@/lib/constants";
import { cn } from "@/lib/utils";
import React from "react";

const CheckOutSteps = ({ current = 0 }) => {
  return (
    <div className="flex-col flex-between md:flex-row mb-10 space-x-2 space-y-2">
      {checkOutSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 text-sm text-center rounded-full ",
              current === index && "bg-secondary"
            )}
          >
            {step}
          </div>
          {step !== "Place Order" && (
            <hr className="w-32 border-t border-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckOutSteps;
