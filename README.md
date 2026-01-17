# claude-frontforge

A powerful CLI tool and library that integrates with Claude Cloud to generate front-end code (components and pages) from natural language prompts.

## Features

- 🚀 **CLI Tool**: Generate front-end components from the command line
- 📦 **Library API**: Use as a Node.js library in your projects
- ⚙️ **Configurable**: Support for custom configuration via `frontforge.config.json`
- 🎨 **Modular Architecture**: Clean, extensible codebase
- 🔌 **Adapter Pattern**: Easy integration with Claude Cloud API
- 📁 **Organized Output**: Generated files saved to `./out` directory
- ✅ **Tested**: Comprehensive test coverage
- 🎯 **TypeScript**: Full TypeScript support with type definitions

## Installation

### Global Installation (CLI)

```bash
npm install -g claude-frontforge
```

### Local Installation (Library)

```bash
npm install claude-frontforge
```

## Quick Start

### CLI Usage

1. Initialize configuration:

```bash
frontforge init
```

2. Edit `frontforge.config.json` with your Claude API key

3. Generate a component:

```bash
frontforge generate "Create a button component with primary and secondary variants"
```

### Advanced CLI Options

```bash
# Specify output path
frontforge generate "Create a login form" --output LoginForm.tsx

# Specify component name
frontforge generate "Create a card" --name ProductCard

# Use custom config file
frontforge generate "Create a navbar" --config ./custom-config.json
```

## Library Usage

```typescript
import { Generator, PlaceholderClaudeAdapter, ConfigLoader } from 'claude-frontforge';

// Load configuration
const configLoader = new ConfigLoader();
const config = configLoader.getConfig();

// Initialize adapter and generator
const adapter = new PlaceholderClaudeAdapter(config.claude?.apiKey);
const generator = new Generator(adapter, config);

// Generate a component
const result = await generator.generate({
  prompt: 'Create a responsive navigation bar',
  componentName: 'NavBar',
});

if (result.success) {
  console.log('Generated files:', result.files);
} else {
  console.error('Error:', result.error);
}
```

## Configuration

Create a `frontforge.config.json` file in your project root:

```json
{
  "outputDir": "./out",
  "claude": {
    "apiKey": "YOUR_API_KEY_HERE",
    "model": "claude-3-sonnet-20240229",
    "maxTokens": 4096
  },
  "templates": {
    "framework": "react",
    "styling": "css"
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | string | `"./out"` | Directory for generated files |
| `claude.apiKey` | string | - | Your Claude API key |
| `claude.model` | string | `"claude-3-sonnet-20240229"` | Claude model to use |
| `claude.maxTokens` | number | `4096` | Maximum tokens for generation |
| `templates.framework` | string | `"react"` | Target framework (react/vue/angular/html) |
| `templates.styling` | string | `"css"` | Styling approach (css/scss/tailwind/styled-components) |

## Project Structure

```
claude-frontforge/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── index.ts            # Library entry point
│   ├── config/             # Configuration management
│   │   ├── loader.ts
│   │   └── types.ts
│   ├── adapters/           # Claude API adapters
│   │   ├── placeholder.ts  # Placeholder implementation
│   │   └── types.ts
│   ├── generator/          # Code generation logic
│   │   └── generator.ts
│   └── utils/              # Utility functions
│       ├── fileWriter.ts
│       └── helpers.ts
├── frontforge.config.json  # Configuration file
└── out/                    # Generated output (default)
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/thiagoedson/claude-frontforge.git
cd claude-frontforge

# Install dependencies
npm install

# Build the project
npm run build
```

### Available Scripts

```bash
npm run build          # Build TypeScript to JavaScript
npm run dev           # Watch mode for development
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run lint          # Lint the code
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Examples

### Generate a Button Component

```bash
frontforge generate "Create a reusable button component with onClick handler"
```

### Generate a Form

```bash
frontforge generate "Create a contact form with name, email, and message fields"
```

### Generate a Card Component

```bash
frontforge generate "Create a card component with image, title, and description"
```

## Claude API Integration

The current implementation uses a placeholder adapter that simulates Claude API responses. To integrate with the actual Claude Cloud API:

1. Implement the `IClaudeAdapter` interface in a new adapter class
2. Add API authentication and request handling
3. Replace `PlaceholderClaudeAdapter` with your implementation

Example custom adapter structure:

```typescript
import { IClaudeAdapter, ClaudeRequestOptions, ClaudeResponse } from 'claude-frontforge';

export class RealClaudeAdapter implements IClaudeAdapter {
  constructor(private apiKey: string) {}

  async generateCode(options: ClaudeRequestOptions): Promise<ClaudeResponse> {
    // Implement actual Claude API call
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

Created with ❤️ for the front-end development community
