import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Timer, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StroopGameProps {
  onClose?: () => void;
}

type ColorKey = "RED" | "BLUE" | "GREEN" | "AMBER";

const COLOR_VALUES: Record<ColorKey, string> = {
  RED: "#ef4444",
  BLUE: "#0ea5e9",
  GREEN: "#22c55e",
  AMBER: "#f59e0b",
};

const COLOR_KEYS: ColorKey[] = ["RED", "BLUE", "GREEN", "AMBER"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function StroopGame({ onClose }: StroopGameProps) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [round, setRound] = useState(0);
  const [label, setLabel] = useState<ColorKey>("RED");
  const [fontColorKey, setFontColorKey] = useState<ColorKey>("BLUE");
  const [start, setStart] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [correct, setCorrect] = useState(0);
  const totalRounds = 12;

  const nextTrial = () => {
    // Ensure we often have incongruent trials
    const newLabel = randomItem(COLOR_KEYS);
    let newFont: ColorKey = randomItem(COLOR_KEYS);
    if (Math.random() < 0.75) {
      // 75% chance: incongruent color
      while (newFont === newLabel) newFont = randomItem(COLOR_KEYS);
    }
    setLabel(newLabel);
    setFontColorKey(newFont);
    setStart(Date.now());
  };

  useEffect(() => {
    if (phase === "play" && round === 0) {
      nextTrial();
    }
  }, [phase, round]);

  const pick = (choice: ColorKey) => {
    const rt = Date.now() - start;
    setTimes((t) => [...t, rt]);
    if (choice === fontColorKey) setCorrect((c) => c + 1);

    if (round < totalRounds - 1) {
      setRound((r) => r + 1);
      nextTrial();
    } else {
      setPhase("result");
    }
  };

  const accuracy = useMemo(() => Math.round((correct / totalRounds) * 100), [correct]);
  const avgRt = useMemo(() => (times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0), [times]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Stroop Challenge</CardTitle>
                  <p className="text-xs text-muted-foreground">Color-Word Interference Task</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Select the COLOR of the word, not what the word says. {totalRounds} trials.</p>
                  <Button variant="hero" size="lg" onClick={() => { setPhase("play"); setRound(0); setTimes([]); setCorrect(0); }}>Start</Button>
                </motion.div>
              )}
              {phase === "play" && (
                <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center text-sm text-muted-foreground">Round {round + 1}/{totalRounds}</div>
                  <div className="text-center text-6xl font-extrabold" style={{ color: COLOR_VALUES[fontColorKey] }}>
                    {label}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {COLOR_KEYS.map((c) => (
                      <Button key={c} variant="secondary" onClick={() => pick(c)}>
                        {c}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{correct}/{totalRounds}</div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <XCircle className="w-5 h-5 text-destructive mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{totalRounds - correct}</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{avgRt}ms</div>
                      <div className="text-xs text-muted-foreground">Avg RT</div>
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
