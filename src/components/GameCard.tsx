import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  metrics: string[];
  icon: LucideIcon;
  accentColor: "primary" | "accent" | "success" | "warning";
  delay?: number;
  onClick?: () => void;
}

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    border: "group-hover:border-primary/50",
    text: "text-primary",
    glow: "group-hover:shadow-[0_0_30px_hsl(199_89%_48%/0.2)]",
  },
  accent: {
    bg: "bg-accent/10",
    border: "group-hover:border-accent/50",
    text: "text-accent",
    glow: "group-hover:shadow-[0_0_30px_hsl(38_92%_50%/0.2)]",
  },
  success: {
    bg: "bg-success/10",
    border: "group-hover:border-success/50",
    text: "text-success",
    glow: "group-hover:shadow-[0_0_30px_hsl(168_76%_42%/0.2)]",
  },
  warning: {
    bg: "bg-warning/10",
    border: "group-hover:border-warning/50",
    text: "text-warning",
    glow: "group-hover:shadow-[0_0_30px_hsl(25_95%_53%/0.2)]",
  },
};

export function GameCard({ title, description, metrics, icon: Icon, accentColor, delay = 0, onClick }: GameCardProps) {
  const colors = colorMap[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        variant="game"
        className={cn(
          "relative overflow-hidden h-full",
          colors.border,
          colors.glow
        )}
        onClick={onClick}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-circuit opacity-50" />
        
        {/* Gradient overlay */}
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", colors.bg)} />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className={cn("p-3 rounded-lg", colors.bg)}>
              <Icon className={cn("w-6 h-6", colors.text)} />
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full bg-muted-foreground/30",
                    i === 1 && "bg-success",
                    i === 2 && "bg-accent"
                  )}
                />
              ))}
            </div>
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Metrics tags */}
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <span
                key={metric}
                className="px-2 py-1 text-xs font-mono rounded-md bg-secondary/50 text-muted-foreground border border-border/50"
              >
                {metric}
              </span>
            ))}
          </div>

          <Button variant="game" className="w-full" size="sm">
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
