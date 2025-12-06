import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Target, Brain, Clock } from "lucide-react";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="elevated" className="overflow-hidden">
              <div className="absolute inset-0 bg-circuit opacity-20" />
              <CardHeader className="relative z-10 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Demo Wellness Report</CardTitle>
                    <p className="text-sm text-muted-foreground">Aggregated preview for illustration</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-mono text-muted-foreground">
                    PREVIEW MODE
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-primary">85%</div>
                    <div className="text-sm text-muted-foreground">Focus Score</div>
                    <div className="text-xs text-muted-foreground">Based on selective attention & recall</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-accent">38</div>
                    <div className="text-sm text-muted-foreground">Stress Index</div>
                    <div className="text-xs text-muted-foreground">Lower is better</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                    <div className="text-3xl font-mono font-bold text-success">Low</div>
                    <div className="text-sm text-muted-foreground">Burnout Risk</div>
                    <div className="text-xs text-muted-foreground">Trend: stable</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <div className="font-medium">Cognitive Load Over Time</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Example trend derived from recent challenges; integrate real data later.</p>
                    <div className="h-32 rounded-md bg-muted" />
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <div className="font-medium">Avg Response Time</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Simulated summary from reaction-based tasks.</p>
                    <div className="h-32 rounded-md bg-muted" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <div className="font-medium">Recommendations</div>
                  </div>
                  <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
                    <li>Short focus blocks (25–30 min), brief recovery between sessions</li>
                    <li>Light workload on days with lower energy check-in</li>
                    <li>Practice recall tasks 3x/week to maintain working memory</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
