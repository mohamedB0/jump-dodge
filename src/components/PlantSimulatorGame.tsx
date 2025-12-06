import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Scale, Timer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlantSimulatorGameProps {
  onClose?: () => void;
}

type Scenario = {
  prompt: string;
  options: { label: string; risk: number; quality: number }[];
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "A pump is overheating but production target is tight. What do you do?",
    options: [
      { label: "Slow line and cool pump", risk: 1, quality: 3 },
      { label: "Push through this batch", risk: 3, quality: 1 },
      { label: "Short maintenance pause", risk: 2, quality: 2 },
    ],
  },
  {
    prompt: "Sensors show intermittent faults on a non-critical line.",
    options: [
      { label: "Continue and monitor", risk: 2, quality: 2 },
      { label: "Pause and inspect", risk: 1, quality: 3 },
      { label: "Ignore until shift end", risk: 3, quality: 1 },
    ],
  },
  {
    prompt: "Raw material batch shows slightly off spec.",
    options: [
      { label: "Reject shipment", risk: 1, quality: 3 },
      { label: "Blend with prior lot", risk: 2, quality: 2 },
      { label: "Use as is to save time", risk: 3, quality: 1 },
    ],
  },
];

export default function PlantSimulatorGame({ onClose }: PlantSimulatorGameProps) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [idx, setIdx] = useState(0);
  const [riskSum, setRiskSum] = useState(0);
  const [qualitySum, setQualitySum] = useState(0);

  const handlePick = (opt: Scenario["options"][number]) => {
    setRiskSum((r) => r + opt.risk);
    setQualitySum((q) => q + opt.quality);
    if (idx < SCENARIOS.length - 1) setIdx(idx + 1);
    else setPhase("result");
  };

  const riskTolerance = useMemo(() => {
    // Lower risk sum -> lower tolerance (good). Higher -> higher tolerance.
    const max = SCENARIOS.length * 3;
    const score = Math.round(((max - riskSum) / max) * 100);
    return score;
  }, [riskSum]);

  const decisionQuality = useMemo(() => {
    const max = SCENARIOS.length * 3;
    return Math.round((qualitySum / max) * 100);
  }, [qualitySum]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Gauge className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-lg">Plant Simulator</CardTitle>
                  <p className="text-xs text-muted-foreground">Risk & Decision Trade-offs</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Choose the best action for each scenario balancing risk and output quality.</p>
                  <Button variant="hero" size="lg" onClick={() => { setPhase("play"); setIdx(0); setRiskSum(0); setQualitySum(0); }}>Start</Button>
                </motion.div>
              )}
              {phase === "play" && (
                <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center text-base text-muted-foreground">Scenario {idx + 1}/{SCENARIOS.length}</div>
                  <div className="text-lg font-medium text-center">{SCENARIOS[idx].prompt}</div>
                  <div className="grid gap-3">
                    {SCENARIOS[idx].options.map((opt) => (
                      <Button key={opt.label} variant="secondary" onClick={() => handlePick(opt)}>
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Scale className="w-5 h-5 text-warning mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{riskTolerance}%</div>
                      <div className="text-xs text-muted-foreground">Risk Tolerance</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{decisionQuality}%</div>
                      <div className="text-xs text-muted-foreground">Decision Quality</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="hero" onClick={() => setPhase("ready")}>Play Again</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
