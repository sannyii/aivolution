import { StructuredContext } from "./context";

export interface Memory {
  id: string;
  type: "short-term" | "long-term" | "episodic" | "semantic";
  timestamp: string;
  content: string;
  embedding?: number[];
  tags?: string[];
  weight?: number;
}

export interface PromptTemplate {
  systemPrompt: string;
  userPrefix?: string;
  assistantPrefix?: string;
  contextFormatter?: (context: StructuredContext) => string;
}

export type OutputFilter = (response: string) => string;

export interface ConversationConfig {
  prompt: PromptTemplate;
  memoryLimit?: number;
  similarityThreshold?: number;
  filters?: OutputFilter[];
}

export interface RetrievedMemory extends Memory {
  score: number;
}

export interface ConversationTurn {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}
