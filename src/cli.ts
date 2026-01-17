#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigLoader } from './config';
import { PlaceholderClaudeAdapter } from './adapters';
import { Generator } from './generator';

const program = new Command();

program
  .name('frontforge')
  .description('CLI tool for generating front-end code using Claude AI')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate front-end code from a prompt')
  .argument('<prompt>', 'Description of the component to generate')
  .option('-o, --output <path>', 'Output file path')
  .option('-n, --name <name>', 'Component name')
  .option('-c, --config <path>', 'Path to config file')
  .action(async (prompt: string, options) => {
    try {
      // Load configuration
      const configLoader = new ConfigLoader(options.config);
      const config = configLoader.getConfig();

      // Initialize adapter and generator
      const adapter = new PlaceholderClaudeAdapter(config.claude?.apiKey, config.claude?.model);
      const generator = new Generator(adapter, config);

      // Generate code
      console.log('FrontForge - Generating your component...\n');
      const result = await generator.generate({
        prompt,
        outputPath: options.output,
        componentName: options.name,
      });

      if (result.success) {
        console.log('\n✓ Success! Files generated:');
        result.files.forEach((file) => console.log(`  - ${file}`));
      } else {
        console.error('\n✗ Error:', result.error);
        process.exit(1);
      }
    } catch (error) {
      console.error('\n✗ Fatal error:', error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new frontforge.config.json file')
  .action(() => {
    const { writeFileSync, existsSync } = require('fs');
    const configPath = './frontforge.config.json';

    if (existsSync(configPath)) {
      console.log('✗ frontforge.config.json already exists');
      process.exit(1);
    }

    const defaultConfig = {
      outputDir: './out',
      claude: {
        apiKey: 'YOUR_API_KEY_HERE',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4096,
      },
      templates: {
        framework: 'react',
        styling: 'css',
      },
    };

    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log('✓ Created frontforge.config.json');
    console.log('\nEdit the file to add your Claude API key and customize settings.');
  });

program.parse(process.argv);
