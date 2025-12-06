import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  AlertTriangle,
  Gauge,
  Focus,
  Battery,
  TrendingUp,
  Clock,
  Target,
  Users,
} from "lucide-react";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { EnergySlider } from "@/components/EnergySlider";
import { MetricDisplay } from "@/components/MetricDisplay";
import { CircuitFixerGame } from "@/components/CircuitFixerGame";
import PartsInventoryGame from "@/components/PartsInventoryGame";
import SafetySignalGame from "@/components/SafetySignalGame";
import PlantSimulatorGame from "@/components/PlantSimulatorGame";
import MemoryCardGame from "@/components/MemoryCardGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const games = [
  {
    title: "Circuit Fixer",
    description: "Quickly tap correct sequences under time pressure. Tests processing speed and error rate.",
    metrics: ["Processing Speed", "Error Rate", "Fatigue Level"],
    icon: Zap,
    accentColor: "primary" as const,
  },
  {
    title: "Parts Inventory",
    description: "Memorize and recall sequences of parts and codes. Measures working memory capacity.",
    metrics: ["Working Memory", "Recall Speed", "Pattern Recognition"],
    icon: Brain,
    accentColor: "accent" as const,
  },
  {
    title: "Safety Signal",
    description: "Categorize words and images quickly. Reveals attentional bias patterns.",
    metrics: ["Attentional Bias", "Response Time", "Emotional Awareness"],
    icon: AlertTriangle,
    accentColor: "warning" as const,
  },
  {
    title: "Plant Simulator",
    description: "Make decisions in simulated work scenarios with trade-offs. Assesses risk tolerance.",
    metrics: ["Risk Tolerance", "Decision Quality", "Stress Response"],
    icon: Gauge,
    accentColor: "success" as const,
  },
  {
    title: "Memory Card",
    description: "Flip cards to find matching pairs. Measures working memory and efficiency.",
    metrics: ["Working Memory", "Moves", "Time"],
    icon: Brain,
    accentColor: "primary" as const,
  },
];

export default function Index() {
  const [energyLevel, setEnergyLevel] = useState(3);
  const [showCircuitFixer, setShowCircuitFixer] = useState(false);
  const [showPartsInventory, setShowPartsInventory] = useState(false);
  const [showSafetySignal, setShowSafetySignal] = useState(false);
  const [showPlantSimulator, setShowPlantSimulator] = useState(false);
  const [showMemoryCard, setShowMemoryCard] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCompleteCheckIn = () => {
    try {
      const payload = { energyLevel, ts: Date.now() };
      localStorage.setItem("vitals.energyCheckIn", JSON.stringify(payload));
      toast({
        title: "Check-in saved",
        description: `Energy level set to ${energyLevel}/5 for today`,
      });
    } catch (e) {
      toast({
        title: "Unable to save",
        description: "We couldn't store your check-in locally.",
        variant: "destructive",
      });
    }
  };

  // Open a game if navigated with state from /challenges
  useEffect(() => {
    const state = location.state as { openGame?: string } | null;
    const openGame = state?.openGame;
    if (!openGame) return;
    if (openGame === "Circuit Fixer") setShowCircuitFixer(true);
    else if (openGame === "Parts Inventory") setShowPartsInventory(true);
    else if (openGame === "Safety Signal") setShowSafetySignal(true);
    else if (openGame === "Plant Simulator") setShowPlantSimulator(true);
    else if (openGame === "Memory Card") setShowMemoryCard(true);
    // Clear state so it doesn't reopen on back/refresh
    navigate(location.pathname, { replace: true });
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm font-mono">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Cognitive Wellness Assessment Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-tight">
              Monitor Your{" "}
              <span className="text-gradient">Mental Vitals</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scientifically-designed challenges that reveal cognitive patterns, stress indicators, 
              and mental wellness metrics—delivered through engaging, respectful gameplay.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="hero" size="xl" onClick={() => setShowCircuitFixer(true)}>
                Start Assessment
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/reports") }>
                View Demo Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Energy Check-in Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-mono">
                <Battery className="w-4 h-4" />
                DAILY CHECK-IN
              </div>
              <h2 className="text-3xl font-mono font-bold">
                How's your energy today?
              </h2>
              <p className="text-muted-foreground">
                A quick self-assessment helps contextualize your game performance. 
                Your baseline energy level provides crucial data for accurate wellness insights.
              </p>
              
              <Card variant="metric" className="p-6">
                <EnergySlider value={energyLevel} onChange={setEnergyLevel} />
              </Card>
            </motion.div>

            {/* Preview Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="elevated" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-circuit opacity-30" />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Today's Metrics Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-5">
                  <MetricDisplay
                    label="Cognitive Load"
                    value={72}
                    maxValue={100}
                    unit="%"
                    icon={Brain}
                    trend="up"
                    color="primary"
                  />
                  <MetricDisplay
                    label="Focus Score"
                    value={85}
                    maxValue={100}
                    unit="pts"
                    icon={Target}
                    trend="stable"
                    color="success"
                  />
                  <MetricDisplay
                    label="Stress Index"
                    value={34}
                    maxValue={100}
                    unit=""
                    icon={AlertTriangle}
                    trend="down"
                    color="warning"
                  />
                  <MetricDisplay
                    label="Avg Response Time"
                    value={423}
                    maxValue={1000}
                    unit="ms"
                    icon={Clock}
                    color="accent"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-3xl font-mono font-bold">
              Cognitive Challenges
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each challenge is designed to measure specific cognitive and psychological indicators. 
              Complete them regularly for the most accurate wellness insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <GameCard
                key={game.title}
                {...game}
                delay={0.1 * index}
                onClick={() => {
                  if (game.title === "Circuit Fixer") setShowCircuitFixer(true);
                  else if (game.title === "Parts Inventory") setShowPartsInventory(true);
                  else if (game.title === "Safety Signal") setShowSafetySignal(true);
                  else if (game.title === "Plant Simulator") setShowPlantSimulator(true);
                  else if (game.title === "Memory Card") setShowMemoryCard(true);
                }}
              />
            ))}

            {/* Special check-in card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="gradient" className="h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-circuit opacity-20" />
                <CardHeader className="relative z-10">
                  <div className="p-3 rounded-lg bg-muted w-fit">
                    <Battery className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Mood & Energy</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Quick visual slider for self-reported well-being. 
                    Provides context for all other metrics.
                  </p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-mono rounded-md bg-secondary/50 text-muted-foreground border border-border/50">
                      Self-Report
                    </span>
                    <span className="px-2 py-1 text-xs font-mono rounded-md bg-secondary/50 text-muted-foreground border border-border/50">
                      Baseline
                    </span>
                  </div>
                  <Button variant="secondary" className="w-full" size="sm" onClick={handleCompleteCheckIn}>
                    Complete Check-in
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HR Dashboard Preview */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="elevated" className="overflow-hidden">
              <div className="absolute inset-0 bg-circuit opacity-20" />
              <CardHeader className="relative z-10 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>HR Administration View</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Actionable insights for wellness programs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-mono text-muted-foreground">
                    PREVIEW MODE
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-primary">87%</div>
                    <div className="text-sm text-muted-foreground">Team Wellness Score</div>
                    <div className="text-xs text-success flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +5% from last month
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-accent">24</div>
                    <div className="text-sm text-muted-foreground">Assessments This Week</div>
                    <div className="text-xs text-muted-foreground">Across 8 team members</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-success">Low</div>
                    <div className="text-sm text-muted-foreground">Burnout Risk Level</div>
                    <div className="text-xs text-muted-foreground">Based on trend analysis</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    HR dashboards provide aggregated, anonymized insights—never individual game scores. 
                    Focus on team wellness trends and actionable recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                <Zap className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-mono">VITALS Wellness Monitor</span>
            </div>
            <p>Cognitive wellness through intelligent assessment.</p>
          </div>
        </div>
      </footer>

      {/* Game Modals */}
      {showCircuitFixer && (
        <CircuitFixerGame onClose={() => setShowCircuitFixer(false)} />
      )}
      {showPartsInventory && (
        <PartsInventoryGame onClose={() => setShowPartsInventory(false)} />
      )}
      {showSafetySignal && (
        <SafetySignalGame onClose={() => setShowSafetySignal(false)} />
      )}
      {showPlantSimulator && (
        <PlantSimulatorGame onClose={() => setShowPlantSimulator(false)} />
      )}
      {showMemoryCard && (
        <MemoryCardGame onClose={() => setShowMemoryCard(false)} />
      )}
    </div>
  );
}
