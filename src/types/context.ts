export interface TimeFrame {
  start: Date;
  end: Date;
}

export interface RawDataPoint {
  source: string;
  timestamp: string;
  metrics: Record<string, number>;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface FeatureEngineeringStep {
  name: string;
  description: string;
  apply: (data: RawDataPoint[]) => EngineeredFeature[];
}

export interface EngineeredFeature {
  key: string;
  value: number | string;
  summary?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AggregationConfig {
  windowMinutes?: number;
  minimumDataPoints?: number;
  featureEngineeringSteps?: FeatureEngineeringStep[];
}

export interface StructuredContext {
  timeframe: TimeFrame;
  features: EngineeredFeature[];
  sourceBreakdown: Record<string, number>;
  narratives: string[];
}

export interface ContextPipelineOptions {
  aggregationConfig?: AggregationConfig;
  narrativeTemplate?: (features: EngineeredFeature[]) => string[];
}
