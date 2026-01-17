import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { FrontForgeConfig, DEFAULT_CONFIG } from './types';

/**
 * Loads configuration from a JSON file
 */
export class ConfigLoader {
  private config: FrontForgeConfig;

  constructor(configPath?: string) {
    this.config = this.loadConfig(configPath);
  }

  /**
   * Load configuration from file or use defaults
   */
  private loadConfig(configPath?: string): FrontForgeConfig {
    const defaultPaths = ['./frontforge.config.json', './frontforge.config.js', './.frontforgerc'];

    const pathsToCheck = configPath ? [configPath, ...defaultPaths] : defaultPaths;

    for (const path of pathsToCheck) {
      const fullPath = resolve(process.cwd(), path);
      if (existsSync(fullPath)) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          const userConfig = JSON.parse(content) as Partial<FrontForgeConfig>;
          return this.mergeConfig(DEFAULT_CONFIG, userConfig);
        } catch (error) {
          console.warn(`Failed to load config from ${path}:`, error);
        }
      }
    }

    return { ...DEFAULT_CONFIG };
  }

  /**
   * Merge user config with default config
   */
  private mergeConfig(
    defaultConfig: FrontForgeConfig,
    userConfig: Partial<FrontForgeConfig>
  ): FrontForgeConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      claude: {
        ...defaultConfig.claude,
        ...userConfig.claude,
      },
      templates: {
        ...defaultConfig.templates,
        ...userConfig.templates,
      },
    };
  }

  /**
   * Get the current configuration
   */
  public getConfig(): FrontForgeConfig {
    return this.config;
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(updates: Partial<FrontForgeConfig>): void {
    this.config = this.mergeConfig(this.config, updates);
  }
}
