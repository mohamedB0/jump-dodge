import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Focus, Timer, CheckCircle2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoisyControlRoomGameProps {
  onClose?: () => void;
}

// Simple selective attention task: click only target shapes while ignoring decoys under light time pressure.
export default function NoisyControlRoomGame({ onClose }: NoisyControlRoomGameProps) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [timeLeft, setTimeLeft] = useState(20);
  const [targetsClicked, setTargetsClicked] = useState(0);
  const [falseClicks, setFalseClicks] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Generate a small grid of items with random targets
  const items = useMemo(() => {
    return Array.from({ length: 24 }, () => ({
      isTarget: Math.random() < 0.35, // 35% are targets
    }));
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase]);

  const accuracy = useMemo(() => {
    const totalClicks = targetsClicked + falseClicks;
    if (totalClicks === 0) return 0;
    return Math.round((targetsClicked / totalClicks) * 100);
  }, [targetsClicked, falseClicks]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Focus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Noisy Control Room</CardTitle>
                  <p className="text-xs text-muted-foreground">Selective Attention Under Distraction</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Click only the highlighted targets while ignoring decoys. You have 20 seconds.</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Volume2 className="w-4 h-4" /> Distractions simulated visually.
                  </div>
                  <Button variant="hero" size="lg" onClick={() => { setTargetsClicked(0); setFalseClicks(0); setTimeLeft(20); setPhase("play"); }}>Start</Button>
                </motion.div>
              )}
              {phase === "play" && (
                <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-mono">Targets: {targetsClicked}</div>
                    <div className="font-mono text-destructive">False: {falseClicks}</div>
                    <div className="flex items-center gap-2 font-mono">
                      <Timer className="w-4 h-4 text-accent" /> {timeLeft}s
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3 select-none">
                    {items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => item.isTarget ? setTargetsClicked((c) => c + 1) : setFalseClicks((f) => f + 1)}
                        className={`h-16 rounded-md border-2 transition-all ${item.isTarget ? "border-success/60 bg-success/20 hover:bg-success/30" : "border-border bg-secondary/40 hover:bg-secondary/60"}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{targetsClicked}</div>
                      <div className="text-xs text-muted-foreground">Targets Clicked</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-destructive mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{falseClicks}</div>
                      <div className="text-xs text-muted-foreground">False Clicks</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
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
