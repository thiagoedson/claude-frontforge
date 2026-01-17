import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

/**
 * File writer utility for saving generated code
 */
export class FileWriter {
  private outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
  }

  /**
   * Write content to a file
   */
  public writeFile(relativePath: string, content: string): string {
    const fullPath = resolve(this.outputDir, relativePath);
    const dir = dirname(fullPath);

    // Ensure directory exists
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Write file
    writeFileSync(fullPath, content, 'utf-8');

    return fullPath;
  }

  /**
   * Write multiple files
   */
  public writeFiles(files: Array<{ path: string; content: string }>): string[] {
    return files.map((file) => this.writeFile(file.path, file.content));
  }

  /**
   * Get the output directory
   */
  public getOutputDir(): string {
    return this.outputDir;
  }

  /**
   * Ensure output directory exists
   */
  public ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }
}
