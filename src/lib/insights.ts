import { differenceInCalendarDays } from "date-fns";
import { StructuredContext } from "@/types/context";
import { InsightSummary, InsightTemplate } from "@/types/insights";

const HEALTH_FIELDS = ["heart_rate.average", "sleep_duration.average", "steps.average"];
const HABIT_FIELDS = ["journal_entries.count", "hydration.average", "focus_sessions.average"];
const EMOTION_FIELDS = ["mood.trend", "stress_level.average", "sentiment.average"];

function buildTemplate(
  id: string,
  domain: InsightTemplate["domain"],
  fields: string[],
  description: string,
  narrative: (context: StructuredContext) => string,
): InsightTemplate {
  return {
    id,
    domain,
    title: `${domain.charAt(0).toUpperCase()}${domain.slice(1)} Snapshot`,
    description,
    fields,
    generate: (ctx, features) => {
      const hasSignals = fields.some((field) => features.some((feature) => feature.key === field));
      if (!hasSignals) {
        return `${ctx.timeframe.end.toDateString()}: insufficient signals for ${domain} insight.`;
      }
      return narrative(ctx);
    },
  };
}

const DEFAULT_TEMPLATES: InsightTemplate[] = [
  buildTemplate(
    "daily-health",
    "health",
    HEALTH_FIELDS,
    "Summarize movement, recovery, and rest quality.",
    (context) => {
      const summary = context.narratives.filter((narrative) =>
        HEALTH_FIELDS.some((field) => narrative.includes(field.split(".")[0])),
      );
      return [
        `Health focus for ${context.timeframe.end.toDateString()}:`,
        ...summary,
      ].join("\n");
    },
  ),
  buildTemplate(
    "daily-habits",
    "habit",
    HABIT_FIELDS,
    "Summarize routines, progress against goals, and consistency.",
    (context) => {
      const summary = context.narratives.filter((narrative) =>
        HABIT_FIELDS.some((field) => narrative.includes(field.split(".")[0])),
      );
      return [
        `Habits to reinforce on ${context.timeframe.end.toDateString()}:`,
        ...summary,
      ].join("\n");
    },
  ),
  buildTemplate(
    "daily-emotions",
    "emotion",
    EMOTION_FIELDS,
    "Summarize mood shifts, stressors, and positive highlights.",
    (context) => {
      const summary = context.narratives.filter((narrative) =>
        EMOTION_FIELDS.some((field) => narrative.includes(field.split(".")[0])),
      );
      return [
        `Emotional landscape for ${context.timeframe.end.toDateString()}:`,
        ...summary,
      ].join("\n");
    },
  ),
];

export function generateDailyInsights(
  context: StructuredContext,
  templates: InsightTemplate[] = DEFAULT_TEMPLATES,
): InsightSummary[] {
  const daysCovered = Math.max(
    1,
    Math.abs(differenceInCalendarDays(context.timeframe.end, context.timeframe.start)) || 1,
  );
  const featuresPerDay = context.features.length / daysCovered;

  return templates.map((template) => ({
    templateId: template.id,
    domain: template.domain,
    content: template.generate(context, context.features),
    generatedAt: new Date().toISOString(),
    metadata: {
      fields: template.fields,
      featuresPerDay,
    },
  }));
}
