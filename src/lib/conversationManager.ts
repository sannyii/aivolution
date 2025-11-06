import { buildStructuredContext, summarizeForPrompt } from "./contextPipeline";
import {
  ConversationConfig,
  ConversationTurn,
  Memory,
  RetrievedMemory,
} from "@/types/conversation";
import { ContextPipelineOptions, RawDataPoint, StructuredContext } from "@/types/context";

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }

  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export class ConversationManager {
  private readonly config: ConversationConfig;

  private readonly memories: Memory[];

  private readonly contextOptions: ContextPipelineOptions;

  constructor(
    config: ConversationConfig,
    memories: Memory[],
    contextOptions: ContextPipelineOptions = {},
  ) {
    this.config = config;
    this.memories = memories;
    this.contextOptions = contextOptions;
  }

  buildContext(rawSignals: RawDataPoint[]): StructuredContext {
    return buildStructuredContext(rawSignals, this.contextOptions);
  }

  retrieveMemories(queryEmbedding?: number[]): RetrievedMemory[] {
    if (!queryEmbedding) {
      return [];
    }

    const similarityThreshold = this.config.similarityThreshold ?? 0.4;
    const rankedMemories = this.memories
      .filter((memory) => memory.embedding && memory.embedding.length === queryEmbedding.length)
      .map((memory) => ({
        ...memory,
        score: cosineSimilarity(queryEmbedding, memory.embedding ?? []),
      }))
      .filter((memory) => memory.score >= similarityThreshold)
      .sort((a, b) => b.score - a.score);

    return rankedMemories.slice(0, this.config.memoryLimit ?? 8);
  }

  buildPrompt(turns: ConversationTurn[], context: StructuredContext): string {
    const { prompt } = this.config;
    const contextSection = prompt.contextFormatter
      ? prompt.contextFormatter(context)
      : summarizeForPrompt(context);

    const conversationHistory = turns
      .map((turn) => `${turn.role.toUpperCase()} (${turn.timestamp}): ${turn.content}`)
      .join("\n");

    return [
      prompt.systemPrompt,
      contextSection,
      conversationHistory,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  filterOutput(response: string): string {
    if (!this.config.filters || this.config.filters.length === 0) {
      return response;
    }

    return this.config.filters.reduce((acc, filter) => filter(acc), response);
  }

  craftAssistantMessage(
    userTurns: ConversationTurn[],
    rawSignals: RawDataPoint[],
    queryEmbedding?: number[],
  ): { prompt: string; memories: RetrievedMemory[]; context: StructuredContext } {
    const context = this.buildContext(rawSignals);
    const retrievedMemories = this.retrieveMemories(queryEmbedding);

    const prompt = this.buildPrompt(userTurns, context);

    return {
      prompt,
      memories: retrievedMemories,
      context,
    };
  }

  registerOutputFilters(filters: ConversationConfig["filters"]): void {
    if (!filters || filters.length === 0) {
      return;
    }

    this.config.filters = [...(this.config.filters ?? []), ...filters];
  }

  static redactionFilter(blockList: string[]): (text: string) => string {
    const pattern = new RegExp(blockList.join("|"), "gi");
    return (text: string) => text.replace(pattern, "[redacted]");
  }

  static styleFilter(styleGuide: string): (text: string) => string {
    return (text: string) => `${styleGuide}\n${text}`;
  }

  static guardrailFilter(maxLength = 1500): (text: string) => string {
    return (text: string) => {
      if (text.length <= maxLength) {
        return text;
      }

      return `${text.slice(0, maxLength)}...`; // Truncate but keep readability
    };
  }
}

export function buildTurn(
  role: ConversationTurn["role"],
  content: string,
  date = new Date(),
): ConversationTurn {
  return {
    role,
    content,
    timestamp: formatTimestamp(date),
  };
}
