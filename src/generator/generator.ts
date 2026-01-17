import { IClaudeAdapter } from '../adapters';
import { FrontForgeConfig } from '../config';
import { FileWriter, extractComponentName, generateFileName } from '../utils';

/**
 * Options for code generation
 */
export interface GenerateOptions {
  prompt: string;
  outputPath?: string;
  componentName?: string;
}

/**
 * Result of code generation
 */
export interface GenerateResult {
  success: boolean;
  files: string[];
  error?: string;
}

/**
 * Generator class that orchestrates code generation
 */
export class Generator {
  private claudeAdapter: IClaudeAdapter;
  private fileWriter: FileWriter;
  private config: FrontForgeConfig;

  constructor(claudeAdapter: IClaudeAdapter, config: FrontForgeConfig) {
    this.claudeAdapter = claudeAdapter;
    this.config = config;
    this.fileWriter = new FileWriter(config.outputDir);
  }

  /**
   * Generate code from a prompt
   */
  public async generate(options: GenerateOptions): Promise<GenerateResult> {
    try {
      // Ensure output directory exists
      this.fileWriter.ensureOutputDir();

      // Determine component name
      const componentName = options.componentName || extractComponentName(options.prompt);

      // Generate code using Claude adapter
      console.log(`Generating component: ${componentName}...`);
      const response = await this.claudeAdapter.generateCode({
        prompt: options.prompt,
        maxTokens: this.config.claude?.maxTokens,
        model: this.config.claude?.model,
      });

      if (!response.success) {
        return {
          success: false,
          files: [],
          error: response.error || 'Failed to generate code',
        };
      }

      // Determine output path
      const outputPath = options.outputPath || generateFileName(componentName, 'tsx');

      // Write generated code to file
      const filePath = this.fileWriter.writeFile(outputPath, response.content);

      console.log(`✓ Generated: ${filePath}`);

      return {
        success: true,
        files: [filePath],
      };
    } catch (error) {
      return {
        success: false,
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate multiple components from prompts
   */
  public async generateBatch(
    prompts: Array<{ prompt: string; componentName?: string }>
  ): Promise<GenerateResult> {
    const allFiles: string[] = [];
    const errors: string[] = [];

    for (const item of prompts) {
      const result = await this.generate(item);
      if (result.success) {
        allFiles.push(...result.files);
      } else {
        errors.push(result.error || 'Unknown error');
      }
    }

    return {
      success: errors.length === 0,
      files: allFiles,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }
}
