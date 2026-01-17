import { ConfigLoader, DEFAULT_CONFIG } from '../config';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('ConfigLoader', () => {
  const testConfigPath = resolve(__dirname, '../../test-config.json');

  afterEach(() => {
    // Clean up test config file
    if (existsSync(testConfigPath)) {
      unlinkSync(testConfigPath);
    }
  });

  it('should load default config when no config file exists', () => {
    const loader = new ConfigLoader('/nonexistent/path.json');
    const config = loader.getConfig();

    expect(config.outputDir).toBe(DEFAULT_CONFIG.outputDir);
    expect(config.claude?.model).toBe(DEFAULT_CONFIG.claude?.model);
  });

  it('should load and merge custom config', () => {
    const customConfig = {
      outputDir: './custom-out',
      claude: {
        maxTokens: 2048,
      },
    };

    writeFileSync(testConfigPath, JSON.stringify(customConfig));
    const loader = new ConfigLoader(testConfigPath);
    const config = loader.getConfig();

    expect(config.outputDir).toBe('./custom-out');
    expect(config.claude?.maxTokens).toBe(2048);
    expect(config.claude?.model).toBe(DEFAULT_CONFIG.claude?.model);
  });

  it('should update config at runtime', () => {
    const loader = new ConfigLoader();
    loader.updateConfig({ outputDir: './updated-out' });
    const config = loader.getConfig();

    expect(config.outputDir).toBe('./updated-out');
  });
});
