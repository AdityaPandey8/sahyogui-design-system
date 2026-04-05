import type { Issue, Urgency, Category } from "@/data/mockData";

const urgencyValue: Record<Urgency, number> = { High: 9, Medium: 6, Low: 3 };

const categoryTravelTime: Partial<Record<Category, number>> = {
  Disaster: 25, Health: 15, Food: 20, Infrastructure: 20,
  Environment: 15, Safety: 10, Communication: 10, Shelter: 18,
};

const categoryTaskTime: Partial<Record<Category, [number, number]>> = {
  Disaster: [30, 60], Health: [20, 40], Food: [15, 30],
  Infrastructure: [20, 45], Environment: [10, 25], Safety: [10, 20],
  Communication: [10, 20], Shelter: [15, 30],
};

/**
 * Priority Score (0–100)
 * Formula: (severity×0.3 + population×0.25 + urgency×0.25 + locationRisk×0.1 + delayImpact×0.1) normalized
 */
export function calcPriorityScore(issue: Issue): number {
  const severity = urgencyValue[issue.severity ?? issue.urgency];
  const population = Math.min(10, Math.max(1, Math.ceil(issue.affectedPeople / 1000)));
  const urgency = urgencyValue[issue.urgency];
  const locationRisk = issue.locationRisk ?? 6;
  const delayImpact = issue.urgency === "High" ? 8 : issue.urgency === "Medium" ? 5 : 3;

  const raw = severity * 0.3 + population * 0.25 + urgency * 0.25 + locationRisk * 0.1 + delayImpact * 0.1;
  // Max possible raw = 9*0.3 + 10*0.25 + 9*0.25 + 10*0.1 + 10*0.1 = 2.7+2.5+2.25+1+1 = 9.45
  return Math.round(Math.min(100, (raw / 9.45) * 100));
}

/**
 * Response Time = Travel Time + Task Time (in minutes)
 */
export function predictResponseTime(issue: Issue): number {
  const travel = categoryTravelTime[issue.category] ?? 15;
  const [min, max] = categoryTaskTime[issue.category] ?? [10, 20];
  // Deterministic midpoint based on affected people scale
  const factor = Math.min(1, issue.affectedPeople / 5000);
  return Math.round(travel + min + (max - min) * factor);
}

/**
 * Volunteers Required = ceil(affectedPeople / 20)
 */
export function estimateVolunteers(issue: Issue): number {
  return Math.max(1, Math.ceil(issue.affectedPeople / 20));
}

/**
 * NGO Requirement based on category + severity
 */
export function estimateNGOs(issue: Issue): number {
  const score = calcPriorityScore(issue);
  if (issue.category === "Disaster") return score >= 80 ? 3 : 2;
  if (issue.category === "Health") return 1;
  if (issue.category === "Food" || issue.category === "Shelter") return score >= 60 ? 2 : 1;
  return score >= 80 ? 3 : score >= 50 ? 2 : 1;
}

/**
 * Smart suggestion text based on priority score
 */
export function generateSuggestion(issue: Issue): string {
  const score = calcPriorityScore(issue);
  const vols = estimateVolunteers(issue);
  const ngos = estimateNGOs(issue);
  const responseTime = predictResponseTime(issue);

  if (score >= 80) {
    return `🚨 Immediate action required — Deploy ${vols} volunteers and coordinate ${ngos} NGOs now. Est. response: ${responseTime} min.`;
  }
  if (score >= 50) {
    return `⚠️ Urgent — Assign ${vols} volunteers within 1 hour. Engage ${ngos} NGO(s). Est. response: ${responseTime} min.`;
  }
  return `✅ Low priority — Schedule ${vols} volunteer(s) for next shift. ${ngos} NGO sufficient. Est. response: ${responseTime} min.`;
}

/**
 * Full AI insights for an issue
 */
export function getAIInsights(issue: Issue) {
  return {
    priorityScore: calcPriorityScore(issue),
    responseTime: predictResponseTime(issue),
    volunteersRequired: estimateVolunteers(issue),
    ngosRequired: estimateNGOs(issue),
    suggestion: generateSuggestion(issue),
    urgencyLabel: issue.urgency,
  };
}
