/**
 * Request options for Claude API
 */
export interface ClaudeRequestOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * Response from Claude API
 */
export interface ClaudeResponse {
  success: boolean;
  content: string;
  error?: string;
}

/**
 * Interface for Claude Cloud adapter
 */
export interface IClaudeAdapter {
  /**
   * Generate code based on a prompt
   */
  generateCode(options: ClaudeRequestOptions): Promise<ClaudeResponse>;

  /**
   * Check if the adapter is properly configured
   */
  isConfigured(): boolean;
}
