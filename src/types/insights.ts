import { EngineeredFeature, StructuredContext } from "./context";

export type InsightDomain = "health" | "habit" | "emotion";

export interface InsightTemplate {
  id: string;
  domain: InsightDomain;
  title: string;
  description: string;
  fields: string[];
  generate: (context: StructuredContext, features: EngineeredFeature[]) => string;
}

export interface InsightSummary {
  templateId: string;
  domain: InsightDomain;
  content: string;
  generatedAt: string;
  metadata?: Record<string, unknown>;
}
