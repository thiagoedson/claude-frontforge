import { PlaceholderClaudeAdapter } from '../adapters';

describe('PlaceholderClaudeAdapter', () => {
  let adapter: PlaceholderClaudeAdapter;

  beforeEach(() => {
    adapter = new PlaceholderClaudeAdapter();
  });

  it('should be configured by default', () => {
    expect(adapter.isConfigured()).toBe(true);
  });

  it('should generate code for button component', async () => {
    const response = await adapter.generateCode({
      prompt: 'Create a button component',
    });

    expect(response.success).toBe(true);
    expect(response.content).toContain('Button');
    expect(response.content).toContain('React.FC');
  });

  it('should generate code for form component', async () => {
    const response = await adapter.generateCode({
      prompt: 'Create a form with name and email fields',
    });

    expect(response.success).toBe(true);
    expect(response.content).toContain('Form');
    expect(response.content).toContain('useState');
  });

  it('should generate code for card component', async () => {
    const response = await adapter.generateCode({
      prompt: 'Create a card component',
    });

    expect(response.success).toBe(true);
    expect(response.content).toContain('Card');
    expect(response.content).toContain('title');
  });

  it('should generate generic component for unknown prompts', async () => {
    const response = await adapter.generateCode({
      prompt: 'Create something',
    });

    expect(response.success).toBe(true);
    expect(response.content).toContain('Component');
  });
});
