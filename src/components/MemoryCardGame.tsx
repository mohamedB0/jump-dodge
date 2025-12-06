import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Timer, CheckCircle2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemoryCardGameProps {
  onClose?: () => void;
}

type Tile = {
  id: number;
  value: string;
  revealed: boolean;
  matched: boolean;
};

const VALUES = ["A", "B", "C", "D", "E", "F", "G", "H"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryCardGame({ onClose }: MemoryCardGameProps) {
  const [phase, setPhase] = useState<"ready" | "play" | "result">("ready");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const grid = 4; // 4x4 grid -> 8 pairs

  const initGame = () => {
    const pairValues = shuffle([...VALUES]).slice(0, (grid * grid) / 2);
    const data = shuffle(
      pairValues.flatMap((v, i) => [
        { id: i * 2, value: v, revealed: false, matched: false },
        { id: i * 2 + 1, value: v, revealed: false, matched: false },
      ])
    );
    setTiles(data);
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
  };

  useEffect(() => {
    let timer: number | undefined;
    if (phase === "play") {
      timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (matches === (grid * grid) / 2 && phase === "play") {
      setPhase("result");
    }
  }, [matches, phase]);

  const handleFlip = (index: number) => {
    if (phase !== "play") return;
    if (tiles[index].matched || tiles[index].revealed) return;
    if (first !== null && second !== null) return; // wait until pair is resolved

    const next = [...tiles];
    next[index] = { ...next[index], revealed: true };
    setTiles(next);

    if (first === null) {
      setFirst(index);
      return;
    }

    setSecond(index);
    setMoves((m) => m + 1);

    const i1 = first;
    const i2 = index;

    if (next[i1].value === next[i2].value) {
      // match
      setTimeout(() => {
        const matchedNext = [...next];
        matchedNext[i1] = { ...matchedNext[i1], matched: true };
        matchedNext[i2] = { ...matchedNext[i2], matched: true };
        setTiles(matchedNext);
        setMatches((c) => c + 1);
        setFirst(null);
        setSecond(null);
      }, 300);
    } else {
      // no match -> hide again
      setTimeout(() => {
        const hideNext = [...next];
        hideNext[i1] = { ...hideNext[i1], revealed: false };
        hideNext[i2] = { ...hideNext[i2], revealed: false };
        setTiles(hideNext);
        setFirst(null);
        setSecond(null);
      }, 700);
    }
  };

  const efficiency = useMemo(() => {
    // Best possible moves equals number of pairs
    const best = (grid * grid) / 2;
    return best ? Math.max(0, Math.round((best / Math.max(best, moves)) * 100)) : 0;
  }, [moves]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Memory Card</CardTitle>
                  <p className="text-xs text-muted-foreground">Pair-matching Working Memory Task</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {phase === "ready" && (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">Flip two cards to find matching pairs. Complete all pairs as fast and efficiently as you can.</p>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => { initGame(); setPhase("play"); }}
                  >
                    Start
                  </Button>
                </motion.div>
              )}
              {phase === "play" && (
                <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-mono flex items-center gap-2"><Timer className="w-4 h-4 text-accent" /> {seconds}s</div>
                    <div className="font-mono">Moves: {moves}</div>
                    <div className="font-mono">Pairs: {matches}/{(grid * grid) / 2}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {tiles.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => handleFlip(i)}
                        className={`h-20 md:h-24 rounded-lg border-2 transition-all ${
                          t.matched
                            ? "border-success/50 bg-success/20"
                            : t.revealed
                            ? "border-primary/60 bg-primary/20"
                            : "border-border bg-secondary/40 hover:bg-secondary/60"
                        }`}
                      >
                        <div className={`text-xl font-mono ${t.revealed || t.matched ? "opacity-100" : "opacity-0"}`}>{t.value}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {phase === "result" && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{seconds}s</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Shuffle className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{moves}</div>
                      <div className="text-xs text-muted-foreground">Moves</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="hero" onClick={() => { setPhase("ready"); }}>Play Again</Button>
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
