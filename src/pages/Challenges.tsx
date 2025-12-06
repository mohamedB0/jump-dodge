import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { useNavigate } from "react-router-dom";
import { Battery, Brain, Focus, Gauge, Zap, AlertTriangle } from "lucide-react";

const games = [
  {
    title: "Circuit Fixer",
    description: "Tap sequences under time pressure.",
    metrics: ["Processing Speed", "Error Rate"],
    icon: Zap,
    accentColor: "primary" as const,
  },
  {
    title: "Parts Inventory",
    description: "Memorize and recall part codes.",
    metrics: ["Working Memory", "Recall Speed"],
    icon: Brain,
    accentColor: "accent" as const,
  },
  {
    title: "Safety Signal",
    description: "Classify SAFE vs DANGER quickly.",
    metrics: ["Attentional Bias", "Response Time"],
    icon: AlertTriangle,
    accentColor: "warning" as const,
  },
  {
    title: "Plant Simulator",
    description: "Make decisions and balance risk.",
    metrics: ["Risk Tolerance", "Decision Quality"],
    icon: Gauge,
    accentColor: "success" as const,
  },
  {
    title: "Memory Card",
    description: "Flip cards to find matching pairs.",
    metrics: ["Working Memory", "Moves", "Time"],
    icon: Brain,
    accentColor: "primary" as const,
  },
];

export default function Challenges() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-mono">
              <Battery className="w-4 h-4" /> CHALLENGES
            </div>
            <h1 className="text-3xl font-mono font-bold">Pick a Challenge</h1>
            <p className="text-muted-foreground">Explore available tasks to assess different cognitive areas.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((g, i) => (
              <GameCard
                key={g.title}
                {...g}
                delay={0.05 * i}
                onClick={() => navigate("/", { state: { openGame: g.title } })}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
