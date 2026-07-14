import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: {
    value: number;
    label: string;
  };
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  change,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    change.value >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {change.value >= 0 ? "+" : ""}
                  {change.value}%
                </span>{" "}
                {change.label}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
