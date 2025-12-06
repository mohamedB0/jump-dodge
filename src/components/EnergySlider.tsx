import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const energyLevels = [
  { value: 1, label: "Very Low", color: "bg-destructive" },
  { value: 2, label: "Low", color: "bg-warning" },
  { value: 3, label: "Moderate", color: "bg-accent" },
  { value: 4, label: "Good", color: "bg-success/70" },
  { value: 5, label: "Excellent", color: "bg-success" },
];

export function EnergySlider({ value, onChange, className }: EnergySliderProps) {
  const currentLevel = energyLevels.find((l) => l.value === value) || energyLevels[2];

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Battery visualization */}
      <div className="relative mx-auto w-24 h-48">
        {/* Battery body */}
        <div className="absolute inset-0 rounded-xl border-2 border-border bg-secondary/30 overflow-hidden">
          {/* Fill level */}
          <motion.div
            className={cn("absolute bottom-0 left-0 right-0", currentLevel.color)}
            initial={{ height: "0%" }}
            animate={{ height: `${(value / 5) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
          
          {/* Battery segments */}
          <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[1px] bg-border/50" />
            ))}
          </div>
        </div>
        
        {/* Battery cap */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-t-md border-2 border-b-0 border-border bg-secondary" />
        
        {/* Glow effect */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl blur-xl opacity-30",
            currentLevel.color
          )}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Slider input */}
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-glow
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-glow
            [&::-moz-range-thumb]:cursor-pointer"
        />
        
        {/* Level markers */}
        <div className="flex justify-between mt-2 px-1">
          {energyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange(level.value)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                value >= level.value ? level.color : "bg-secondary",
                value === level.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            />
          ))}
        </div>
      </div>

      {/* Current level label */}
      <div className="text-center">
        <motion.span
          key={currentLevel.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-lg font-mono font-semibold",
            value <= 2 ? "text-destructive" : value <= 3 ? "text-accent" : "text-success"
          )}
        >
          {currentLevel.label}
        </motion.span>
      </div>
    </div>
  );
}
