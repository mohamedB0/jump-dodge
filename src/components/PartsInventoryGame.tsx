import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Timer, Type, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PartsInventoryGameProps {
  onClose?: () => void;
}

const ITEMS = [
  "A1", "B4", "C7", "D2", "E5", "F9", "G3", "H8", "J6", "K0"
];

export default function PartsInventoryGame({ onClose }: PartsInventoryGameProps) {
  const [phase, setPhase] = useState<"ready" | "show" | "recall" | "result">("ready");
  const [sequence, setSequence] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [start, setStart] = useState(0);
  const [times, setTimes] = useState<number[]>([]);

  const length = 5;

  const nextRound = useCallback(() => {
    const seq = Array.from({ length }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)]);
    setSequence(seq);
    setIndex(0);
    setPhase("show");
  }, [length]);

  useEffect(() => {
    if (phase !== "show") return;
    const timer = setTimeout(() => {
      if (index < sequence.length - 1) {
        setIndex(index + 1);
      } else {
        setPhase("recall");
        setStart(Date.now());
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [phase, index, sequence.length]);

  const score = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] === answers[i]) correct++;
    }
    return Math.round((correct / (sequence.length || 1)) * 100);
  }, [sequence, answers]);

  const avgTime = useMemo(() => {
    if (!times.length) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  }, [times]);

  const submitAnswer = () => {
    if (!input.trim()) return;
    const responseTime = Date.now() - start;
    setTimes((t) => [...t, responseTime]);
    const next = [...answers, input.trim().toUpperCase()];
    setAnswers(next);
    setInput("");
    setStart(Date.now());
    if (next.length === sequence.length) setPhase("result");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Brain className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Parts Inventory</CardTitle>
                  <p className="text-xs text-muted-foreground">Working Memory Challenge</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Memorize the sequence of part codes, then type them back in order.</p>
                  <Button variant="hero" size="lg" onClick={nextRound}>Start</Button>
                </motion.div>
              )}
              {phase === "show" && (
                <motion.div key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-2">
                  <div className="text-sm text-muted-foreground">Memorize ({index + 1}/{sequence.length})</div>
                  <div className="text-4xl font-mono">{sequence[index]}</div>
                </motion.div>
              )}
              {phase === "recall" && (
                <motion.div key="recall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">Enter items in order</div>
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length }, (_, i) => (
                      <div key={i} className="w-12 h-10 rounded-md border border-border flex items-center justify-center font-mono bg-secondary/50">
                        {answers[i] || ""}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        className="w-full h-10 rounded-md border border-border bg-secondary/50 px-3 font-mono outline-none focus:border-primary"
                        placeholder="Type like A1"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                      />
                    </div>
                    <Button onClick={submitAnswer}>Submit</Button>
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{score}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{avgTime}ms</div>
                      <div className="text-xs text-muted-foreground">Avg. Entry Time</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Type className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground break-words">{sequence.join(" · ")}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="hero" onClick={() => { setPhase("ready"); setAnswers([]); setTimes([]); }}>Play Again</Button>
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
