import { useMemo } from "react";
import { issues as allIssues } from "@/data/mockData";
import { calcPriorityScore, predictResponseTime } from "@/lib/ai-insights";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3, Clock, TrendingUp } from "lucide-react";

const COLORS = [
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
];

export function AIAnalyticsCharts() {
  const distributionData = useMemo(() => {
    const buckets = { "High (80–100)": 0, "Medium (50–79)": 0, "Low (0–49)": 0 };
    allIssues.forEach(issue => {
      const score = calcPriorityScore(issue);
      if (score >= 80) buckets["High (80–100)"]++;
      else if (score >= 50) buckets["Medium (50–79)"]++;
      else buckets["Low (0–49)"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, []);

  const responseTimeData = useMemo(() => {
    return allIssues
      .map(issue => ({
        name: issue.id,
        title: issue.title.length > 20 ? issue.title.slice(0, 20) + "…" : issue.title,
        score: calcPriorityScore(issue),
        responseTime: predictResponseTime(issue),
      }))
      .sort((a, b) => b.score - a.score);
  }, []);

  const categoryData = useMemo(() => {
    const map: Record<string, { totalScore: number; count: number; totalTime: number }> = {};
    allIssues.forEach(issue => {
      if (!map[issue.category]) map[issue.category] = { totalScore: 0, count: 0, totalTime: 0 };
      map[issue.category].totalScore += calcPriorityScore(issue);
      map[issue.category].totalTime += predictResponseTime(issue);
      map[issue.category].count++;
    });
    return Object.entries(map).map(([category, d]) => ({
      category,
      avgScore: Math.round(d.totalScore / d.count),
      avgTime: Math.round(d.totalTime / d.count),
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Priority Distribution Pie */}
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold">Priority Score Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {distributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time by Issue Bar Chart */}
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold">Est. Response Time by Issue (min)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={responseTimeData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value} min`, "Response Time"]}
                labelFormatter={(label) => {
                  const item = responseTimeData.find(d => d.name === label);
                  return item?.title || label;
                }}
              />
              <Bar dataKey="responseTime" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold">Category-wise Avg Priority & Response Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--primary))" strokeWidth={2} name="Avg Priority Score" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avgTime" stroke="hsl(var(--warning))" strokeWidth={2} name="Avg Response Time (min)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground text-center mt-2 italic">AI-Powered Analytics (Simulated)</p>
      </div>
    </motion.div>
  );
}
