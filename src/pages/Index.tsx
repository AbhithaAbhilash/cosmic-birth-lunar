import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, Share2, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMoonPhase, MoonPhaseData } from "@/lib/moonPhase";
import MoonVisualization from "@/components/MoonVisualization";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-body h-12 bg-card border-border hover:bg-muted hover:border-primary/50 transition-all duration-300",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "MMMM d, yyyy") : "Select your birth date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border" align="center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d > new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

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

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 text-xs text-muted-foreground/50 font-body"
        >
          Moon phases calculated using astronomical algorithms
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
