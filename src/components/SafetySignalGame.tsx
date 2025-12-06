import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SafetySignalGameProps {
  onClose?: () => void;
}

const STIMULI = [
  { label: "SAFE", type: "safe" },
  { label: "DANGER", type: "danger" },
  { label: "CALM", type: "safe" },
  { label: "ALERT", type: "danger" },
  { label: "PEACE", type: "safe" },
  { label: "WARNING", type: "danger" },
];

export default function SafetySignalGame({ onClose }: SafetySignalGameProps) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (phase === "play") setStart(Date.now());
  }, [phase, index]);

  const handle = (choice: "safe" | "danger") => {
    const rt = Date.now() - start;
    setTimes((t) => [...t, rt]);
    if (STIMULI[index].type === choice) setCorrect((c) => c + 1);
    if (index < STIMULI.length - 1) {
      setIndex(index + 1);
    } else {
      setPhase("result");
    }
  };

  const accuracy = useMemo(() => Math.round((correct / STIMULI.length) * 100), [correct]);
  const avgRt = useMemo(() => (times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0), [times]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-lg">Safety Signal</CardTitle>
                  <p className="text-xs text-muted-foreground">Attentional Bias Challenge</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Classify each word as SAFE or DANGER as fast as you can.</p>
                  <Button variant="hero" size="lg" onClick={() => setPhase("play")}>Start</Button>
                </motion.div>
              )}
              {phase === "play" && (
                <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center text-5xl font-mono py-4">{STIMULI[index].label}</div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="secondary" size="lg" onClick={() => handle("safe")}>SAFE</Button>
                    <Button variant="destructive" size="lg" onClick={() => handle("danger")}>DANGER</Button>
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{avgRt}ms</div>
                      <div className="text-xs text-muted-foreground">Avg. Response</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="hero" onClick={() => { setPhase("ready"); setIndex(0); setTimes([]); setCorrect(0); }}>Play Again</Button>
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
