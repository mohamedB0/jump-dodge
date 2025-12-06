import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, XCircle, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CircuitFixerGameProps {
  onComplete?: (score: number, accuracy: number, avgTime: number) => void;
  onClose?: () => void;
}

// Generate random circuit pattern
const generatePattern = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 4));
};

const COLORS = [
  { name: "Red", class: "bg-destructive", activeClass: "bg-destructive shadow-[0_0_20px_hsl(0_72%_51%/0.5)]" },
  { name: "Blue", class: "bg-primary", activeClass: "bg-primary shadow-[0_0_20px_hsl(199_89%_48%/0.5)]" },
  { name: "Green", class: "bg-success", activeClass: "bg-success shadow-[0_0_20px_hsl(168_76%_42%/0.5)]" },
  { name: "Amber", class: "bg-accent", activeClass: "bg-accent shadow-[0_0_20px_hsl(38_92%_50%/0.5)]" },
];

export function CircuitFixerGame({ onComplete, onClose }: CircuitFixerGameProps) {
  const [gameState, setGameState] = useState<"ready" | "showing" | "input" | "result">("ready");
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState(-1);

  const maxRounds = 5;
  const basePatternLength = 3;

  // Show pattern sequence
  const showPattern = useCallback(async (patternToShow: number[]) => {
    setGameState("showing");
    setShowingIndex(-1);
    
    await new Promise((r) => setTimeout(r, 500));
    
    for (let i = 0; i < patternToShow.length; i++) {
      setShowingIndex(i);
      setActiveButton(patternToShow[i]);
      // Increase active flash duration for clearer visibility
      await new Promise((r) => setTimeout(r, 800));
      setActiveButton(null);
      // Slightly increase the gap between flashes
      await new Promise((r) => setTimeout(r, 250));
    }
    
    setShowingIndex(-1);
    setGameState("input");
    setStartTime(Date.now());
  }, []);

  // Start new round
  const startRound = useCallback(() => {
    const newPattern = generatePattern(basePatternLength + round - 1);
    setPattern(newPattern);
    setUserInput([]);
    showPattern(newPattern);
  }, [round, showPattern]);

  // Handle button press
  const handleButtonPress = (index: number) => {
    if (gameState !== "input") return;

    const responseTime = Date.now() - startTime;
    setResponseTimes((prev) => [...prev, responseTime]);
    
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 150);

    const newInput = [...userInput, index];
    setUserInput(newInput);

    // Check if correct
    if (pattern[newInput.length - 1] !== index) {
      setErrors((prev) => prev + 1);
      // Wrong - flash error and continue
      setTimeout(() => {
        if (round < maxRounds) {
          setRound((r) => r + 1);
          setTimeout(startRound, 500);
        } else {
          setGameState("result");
        }
      }, 500);
      return;
    }

    // Check if complete
    if (newInput.length === pattern.length) {
      setScore((prev) => prev + pattern.length * 10);
      if (round < maxRounds) {
        setRound((r) => r + 1);
        setTimeout(startRound, 800);
      } else {
        setGameState("result");
      }
    } else {
      setStartTime(Date.now()); // Reset timer for next input
    }
  };

  // Calculate results
  const accuracy = Math.round(((maxRounds - errors) / maxRounds) * 100);
  const avgTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg"
      >
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit opacity-30" />
          
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Circuit Fixer</CardTitle>
                  <p className="text-xs text-muted-foreground">Speed & Accuracy Challenge</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Stats bar */}
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">Round {round}/{maxRounds}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-primary">{score} pts</span>
              </div>
            </div>

            {/* Game area */}
            <AnimatePresence mode="wait">
              {gameState === "ready" && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-4"
                >
                  <p className="text-muted-foreground">
                    Watch the sequence carefully, then repeat it.
                  </p>
                  <Button variant="hero" size="lg" onClick={startRound}>
                    Start Challenge
                  </Button>
                </motion.div>
              )}

              {(gameState === "showing" || gameState === "input") && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Status indicator */}
                  <div className="text-center">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono",
                      gameState === "showing" 
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-success/10 text-success border border-success/20"
                    )}>
                      {gameState === "showing" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          MEMORIZE SEQUENCE ({showingIndex + 1}/{pattern.length})
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-success" />
                          YOUR TURN ({userInput.length}/{pattern.length})
                        </>
                      )}
                    </span>
                  </div>

                  {/* Current color name during showing phase for extra clarity */}
                  {gameState === "showing" && showingIndex >= 0 && (
                    <div className="text-center text-xl md:text-2xl font-mono text-muted-foreground">
                      {COLORS[pattern[showingIndex]]?.name}
                    </div>
                  )}

                  {/* Button grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {COLORS.map((color, index) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.95 }}
                        disabled={gameState !== "input"}
                        onClick={() => handleButtonPress(index)}
                        className={cn(
                          "aspect-square rounded-xl transition-all duration-200 border-2 border-border will-change-transform",
                          activeButton === index 
                            ? cn(color.activeClass, "scale-110 ring-4 ring-white/60")
                            : color.class,
                          // Dim non-active buttons during the showing phase to make the active one stand out
                          gameState === "showing" && activeButton !== index && "opacity-40",
                          gameState === "input" && "cursor-pointer hover:brightness-110",
                          gameState !== "input" && ""
                        )}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {gameState === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-mono font-bold text-gradient">
                      Challenge Complete
                    </h3>
                    <p className="text-muted-foreground">Great cognitive workout!</p>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Target className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{score}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-mono font-bold">{avgTime}ms</div>
                      <div className="text-xs text-muted-foreground">Avg. Time</div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    <Button 
                      variant="hero" 
                      onClick={() => {
                        setRound(1);
                        setScore(0);
                        setErrors(0);
                        setResponseTimes([]);
                        setGameState("ready");
                      }}
                    >
                      Play Again
                    </Button>
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
