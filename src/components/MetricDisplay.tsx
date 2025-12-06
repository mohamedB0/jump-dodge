import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricDisplayProps {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  color?: "primary" | "accent" | "success" | "warning";
}

const colorClasses = {
  primary: {
    bar: "bg-primary",
    glow: "shadow-[0_0_10px_hsl(199_89%_48%/0.5)]",
    text: "text-primary",
  },
  accent: {
    bar: "bg-accent",
    glow: "shadow-[0_0_10px_hsl(38_92%_50%/0.5)]",
    text: "text-accent",
  },
  success: {
    bar: "bg-success",
    glow: "shadow-[0_0_10px_hsl(168_76%_42%/0.5)]",
    text: "text-success",
  },
  warning: {
    bar: "bg-warning",
    glow: "shadow-[0_0_10px_hsl(25_95%_53%/0.5)]",
    text: "text-warning",
  },
};

export function MetricDisplay({
  label,
  value,
  maxValue,
  unit = "",
  icon: Icon,
  trend = "stable",
  color = "primary",
}: MetricDisplayProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const colors = colorClasses[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", colors.text)} />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("text-lg font-mono font-bold", colors.text)}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
          {trend !== "stable" && (
            <span className={cn(
              "text-xs",
              trend === "up" ? "text-success" : "text-success"
            )}>
              {trend === "up" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", colors.bar, colors.glow)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Segment markers */}
        <div className="absolute inset-0 flex">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-background/20 last:border-r-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
