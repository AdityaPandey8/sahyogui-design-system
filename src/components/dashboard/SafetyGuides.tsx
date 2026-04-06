import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, AlertTriangle, Droplets, Flame, Wind, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const protocols = [
  {
    id: "flood",
    title: "Flood Safety Protocol",
    icon: Droplets,
    color: "text-blue-500",
    steps: [
      "Move to higher ground immediately. Avoid low-lying areas.",
      "Do not walk or drive through floodwaters. Just 6 inches of moving water can knock you down.",
      "Stay away from power lines and electrical wires.",
      "Listen to local radio or TV for updated information.",
      "If trapped in a building, move to the highest floor. Do not go into the attic."
    ]
  },
  {
    id: "fire",
    title: "Fire Safety Protocol",
    icon: Flame,
    color: "text-orange-500",
    steps: [
      "Stop, Drop, and Roll if your clothes catch fire.",
      "Crawl low under smoke to find the nearest exit.",
      "Before opening a door, feel it with the back of your hand. If hot, use another exit.",
      "Once outside, stay outside. Never go back into a burning building.",
      "Call emergency services immediately once safe."
    ]
  },
  {
    id: "medical",
    title: "First Aid Basics",
    icon: HeartPulse,
    color: "text-red-500",
    steps: [
      "Check the scene for safety before approaching the victim.",
      "Check for responsiveness and breathing.",
      "Call for medical help immediately (102/108).",
      "Apply direct pressure to any bleeding wounds.",
      "Keep the victim warm and calm until help arrives."
    ]
  }
];

export function SafetyGuides() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-success" /> Safety Command Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {protocols.map((protocol, index) => (
            <AccordionItem key={protocol.id} value={protocol.id} className="border-border/50">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-background border border-border/50 ${protocol.color}`}>
                    <protocol.icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm">{protocol.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pb-4 pl-11">
                  {protocol.steps.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/10 flex items-start gap-3">
           <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
           <div>
             <p className="text-xs font-bold text-destructive uppercase tracking-widest">Emergency Hotline</p>
             <p className="text-sm font-black mt-1">Dial 112 for immediate assistance</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
