import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { safetyTips, helplineNumbers } from "@/data/mockData";
import { Phone, ShieldCheck } from "lucide-react";

export function SafetyTipsAccordion() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">Safety & Awareness</h3>
      </div>
      <Accordion type="single" collapsible className="space-y-1">
        {safetyTips.map((tip) => (
          <AccordionItem key={tip.id} value={tip.id} className="border rounded-md px-3">
            <AccordionTrigger className="text-sm py-2">{tip.title}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground pb-3">{tip.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-semibold">Emergency Helplines</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {helplineNumbers.map((h) => (
            <div key={h.number} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{h.name}</span>
              <span className="font-bold tabular-nums">{h.number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
