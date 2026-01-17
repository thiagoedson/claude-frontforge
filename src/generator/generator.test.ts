import { Generator } from '../generator';
import { PlaceholderClaudeAdapter } from '../adapters';
import { DEFAULT_CONFIG } from '../config';
import { existsSync, unlinkSync, rmdirSync } from 'fs';
import { resolve } from 'path';

describe('Generator', () => {
  const testOutputDir = resolve(__dirname, '../../test-out');
  const config = { ...DEFAULT_CONFIG, outputDir: testOutputDir };
  let generator: Generator;

  beforeEach(() => {
    const adapter = new PlaceholderClaudeAdapter();
    generator = new Generator(adapter, config);
  });

  afterEach(() => {
    // Clean up test output directory
    if (existsSync(testOutputDir)) {
      const files = require('fs').readdirSync(testOutputDir);
      files.forEach((file: string) => {
        unlinkSync(resolve(testOutputDir, file));
      });
      rmdirSync(testOutputDir);
    }
  });

  it('should generate a component file', async () => {
    const result = await generator.generate({
      prompt: 'Create a button component',
    });

    expect(result.success).toBe(true);
    expect(result.files.length).toBe(1);
    expect(existsSync(result.files[0])).toBe(true);
  });

  it('should use custom component name', async () => {
    const result = await generator.generate({
      prompt: 'Create a button',
      componentName: 'CustomButton',
    });

    expect(result.success).toBe(true);
    expect(result.files[0]).toContain('CustomButton');
  });

  it('should handle generation errors gracefully', async () => {
    // This test validates error handling structure
    const result = await generator.generate({
      prompt: '',
    });

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('files');
  });
});
