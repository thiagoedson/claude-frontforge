/**
 * Configuration interface for FrontForge
 */
export interface FrontForgeConfig {
  /**
   * Output directory for generated files
   */
  outputDir: string;

  /**
   * Claude API configuration
   */
  claude?: {
    apiKey?: string;
    model?: string;
    maxTokens?: number;
  };

  /**
   * Default template settings
   */
  templates?: {
    framework?: 'react' | 'vue' | 'angular' | 'html';
    styling?: 'css' | 'scss' | 'tailwind' | 'styled-components';
  };
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: FrontForgeConfig = {
  outputDir: './out',
  claude: {
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4096,
  },
  templates: {
    framework: 'react',
    styling: 'css',
  },
};
