import { addMinutes, parseISO } from "date-fns";
import {
  AggregationConfig,
  ContextPipelineOptions,
  EngineeredFeature,
  RawDataPoint,
  StructuredContext,
  TimeFrame,
} from "@/types/context";

const DEFAULT_AGGREGATION: Required<Pick<AggregationConfig, "minimumDataPoints" | "windowMinutes">> = {
  minimumDataPoints: 3,
  windowMinutes: 1440,
};

const DEFAULT_FEATURES: EngineeredFeature[] = [];

function ensureTimeFrame(data: RawDataPoint[]): TimeFrame {
  if (data.length === 0) {
    const now = new Date();
    return { start: now, end: now };
  }

  const timestamps = data
    .map((point) => parseISO(point.timestamp))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    start: timestamps[0],
    end: timestamps[timestamps.length - 1],
  };
}

function aggregateSources(data: RawDataPoint[]): Record<string, number> {
  return data.reduce<Record<string, number>>((acc, point) => {
    acc[point.source] = (acc[point.source] ?? 0) + 1;
    return acc;
  }, {});
}

function normalizeValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value === 0) {
    return 0;
  }

  return Number((value / Math.abs(value)).toFixed(4));
}

function rollingAverage(values: number[], windowSize: number): number[] {
  if (windowSize <= 0) {
    return values;
  }

  const averages: number[] = [];

  for (let i = 0; i < values.length; i += 1) {
    const windowStart = Math.max(0, i - windowSize + 1);
    const window = values.slice(windowStart, i + 1);
    const average = window.reduce((sum, value) => sum + value, 0) / window.length;
    averages.push(Number(average.toFixed(3)));
  }

  return averages;
}

function defaultNarratives(features: EngineeredFeature[]): string[] {
  if (features.length === 0) {
    return [
      "No structured signals detected today. Encourage the user to share more for better guidance.",
    ];
  }

  return features.map((feature) =>
    `${feature.key}: ${feature.summary ?? feature.value}`,
  );
}

function enforceWindow(
  data: RawDataPoint[],
  aggregationConfig: Required<Pick<AggregationConfig, "windowMinutes" | "minimumDataPoints">>,
): RawDataPoint[] {
  if (data.length <= aggregationConfig.minimumDataPoints) {
    return data;
  }

  const ordered = [...data].sort(
    (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime(),
  );
  const latest = parseISO(ordered[0].timestamp);
  const windowStart = addMinutes(latest, -aggregationConfig.windowMinutes);

  return ordered.filter((point) => parseISO(point.timestamp) >= windowStart);
}

function executeFeatureSteps(
  data: RawDataPoint[],
  steps: AggregationConfig["featureEngineeringSteps"],
): EngineeredFeature[] {
  if (!steps || steps.length === 0) {
    return DEFAULT_FEATURES;
  }

  return steps.flatMap((step) => step.apply(data));
}

function buildDerivedFeatures(data: RawDataPoint[]): EngineeredFeature[] {
  if (data.length === 0) {
    return [];
  }

  const metrics = new Set<string>();
  data.forEach((point) => Object.keys(point.metrics).forEach((metric) => metrics.add(metric)));

  return Array.from(metrics).flatMap((metric) => {
    const metricSeries = data
      .map((point) => point.metrics[metric])
      .filter((value): value is number => Number.isFinite(value));

    if (metricSeries.length === 0) {
      return [];
    }

    const avg = metricSeries.reduce((sum, value) => sum + value, 0) / metricSeries.length;
    const normalizedTrend = rollingAverage(metricSeries, Math.min(3, metricSeries.length));

    return [
      {
        key: `${metric}.average`,
        value: Number(avg.toFixed(2)),
        summary: `Average ${metric} at ${avg.toFixed(1)}`,
        confidence: Math.min(1, metricSeries.length / 10),
      },
      {
        key: `${metric}.trend`,
        value: normalizedTrend[normalizedTrend.length - 1] ?? 0,
        summary: `Trend direction ${normalizedTrend.at(-1) ?? 0}`,
        metadata: { series: normalizedTrend },
      },
    ];
  });
}

export function buildStructuredContext(
  data: RawDataPoint[],
  options: ContextPipelineOptions = {},
): StructuredContext {
  const aggregationConfig = {
    ...DEFAULT_AGGREGATION,
    ...options.aggregationConfig,
  };

  const bounded = enforceWindow(data, aggregationConfig);
  const features = [
    ...buildDerivedFeatures(bounded),
    ...executeFeatureSteps(bounded, aggregationConfig.featureEngineeringSteps),
  ];

  const normalizedFeatures = features.map((feature) =>
    typeof feature.value === "number"
      ? { ...feature, metadata: { ...feature.metadata, normalized: normalizeValue(feature.value) } }
      : feature,
  );

  return {
    timeframe: ensureTimeFrame(bounded),
    features: normalizedFeatures,
    sourceBreakdown: aggregateSources(bounded),
    narratives: options.narrativeTemplate?.(normalizedFeatures) ?? defaultNarratives(normalizedFeatures),
  };
}

export function summarizeForPrompt(context: StructuredContext): string {
  const summaryLines = [
    `Timeframe: ${context.timeframe.start.toISOString()} - ${context.timeframe.end.toISOString()}`,
    `Signals captured from ${Object.keys(context.sourceBreakdown).length} sources`,
  ];

  summaryLines.push(
    ...context.features.map(
      (feature) =>
        `${feature.key}: ${
          typeof feature.value === "number" ? feature.value.toFixed(2) : feature.value
        } (${feature.summary ?? "no summary"})`,
    ),
  );

  return summaryLines.join("\n");
}
