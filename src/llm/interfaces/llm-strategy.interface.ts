export interface ILlmStrategy {
  readonly providerName: string;
  generateDescription(prompt: string): Promise<string>;
}

export interface GenerateDescriptionInput {
  pageName: string;
  category: string;
  customPrompt?: string;
}

export const LLM_STRATEGIES = Symbol('LLM_STRATEGIES');
