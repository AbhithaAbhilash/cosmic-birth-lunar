import { useState } from "react";
import { format } from "date-fns";
import { Share2, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMoonPhase, MoonPhaseData } from "@/lib/moonPhase";
import MoonVisualization from "@/components/MoonVisualization";
import BirthDatePicker from "@/components/BirthDatePicker";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleDiscover = () => {
    if (!date) return;
    const data = getMoonPhase(date);
    setMoonData(data);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setMoonData(null);
    setDate(undefined);
  };

  const handleShare = async () => {
    if (!moonData || !date) return;
    const text = `On ${format(date, "MMMM d, yyyy")}, the moon was a ${moonData.phaseName} (${moonData.illumination}% illuminated). ${moonData.poeticLine}`;
    if (navigator.share) {
      await navigator.share({ title: "My Birth Moon", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen stars-bg relative overflow-hidden">
      {/* Nebula gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-nebula/20 via-transparent to-nebula/10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 max-w-md w-full"
            >
              {/* Title */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Moon className="w-12 h-12 mx-auto text-moon-glow mb-4" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-light tracking-wide text-foreground">
                  Your Birth Moon
                </h1>
                <p className="text-muted-foreground font-body text-sm sm:text-base max-w-xs mx-auto">
                  Discover the phase of the moon on the night you were born
                </p>
              </div>

              {/* Date Picker */}
              <div className="w-full max-w-xs space-y-4">
                <BirthDatePicker date={date} onSelect={setDate} />

                <Button
                  onClick={handleDiscover}
                  disabled={!date}
                  className="w-full h-12 font-body bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60 transition-all duration-300 disabled:opacity-30"
                >
                  Reveal My Moon
                </Button>
              </div>
            </motion.div>
          ) : (
            moonData && date && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6 max-w-lg w-full px-4"
              >
                {/* Moon Image */}
                <MoonVisualization phase={moonData.phase} phaseName={moonData.phaseName} />

                {/* Phase Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <p className="text-muted-foreground font-body text-sm">
                    {format(date, "MMMM d, yyyy")}
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-display font-light text-foreground">
                    {moonData.emoji} {moonData.phaseName}
                  </h2>

                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${moonData.illumination}%` }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                    <span className="text-sm font-body text-accent">
                      {moonData.illumination}% illuminated
                    </span>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-base sm:text-lg font-display italic text-muted-foreground max-w-sm mx-auto leading-relaxed"
                  >
                    "{moonData.poeticLine}"
                  </motion.p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex gap-3 mt-4"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="font-body border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="font-body border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  >
                    Try Another Date
                  </Button>
                </motion.div>
              </motion.div>
            )
          )}
        </AnimatePresence>

      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 w-full py-8 mt-auto border-t border-border/30"
      >
        <div className="flex flex-col items-center gap-1.5 text-center px-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-body font-medium text-muted-foreground/70">
              © 2026 Abhitha Abhilash
            </p>
            <a
              href="http://linkedin.com/in/abhitha-abhilash-97567437a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <p className="text-xs font-body text-muted-foreground/40 italic">
            Crafted with curiosity under the same moonlight.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
