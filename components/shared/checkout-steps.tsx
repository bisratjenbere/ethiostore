import { checkOutSteps } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CheckOutSteps = ({ current = 0 }) => {
  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <h2 className="sr-only">Checkout Steps</h2>
      <ol className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
        {checkOutSteps.map((step, index) => (
          <li key={step} className="flex items-center w-full md:w-auto">
            <div
              className={cn(
                "p-3 md:p-2 w-full md:w-56 text-sm md:text-base text-center rounded-lg md:rounded-full transition-colors",
                current === index && "bg-secondary font-medium",
                current > index && "text-muted-foreground",
                current < index && "text-muted-foreground/60"
              )}
              aria-current={current === index ? "step" : undefined}
            >
              <span className="md:hidden font-semibold mr-2">{index + 1}.</span>
              {step}
            </div>
            {step !== "Place Order" && (
              <hr className="w-32 border-t border-gray-300 hidden md:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckOutSteps;
