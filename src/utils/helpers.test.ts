import { extractComponentName, capitalizeFirst, generateFileName } from '../utils';

describe('Utility functions', () => {
  describe('extractComponentName', () => {
    it('should extract component name from create prompt', () => {
      expect(extractComponentName('create a button')).toBe('Button');
      expect(extractComponentName('generate card component')).toBe('Card');
    });

    it('should extract quoted component names', () => {
      expect(extractComponentName('create a "LoginForm" component')).toBe('LoginForm');
    });

    it('should return default name for unclear prompts', () => {
      expect(extractComponentName('something')).toBe('Component');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('button')).toBe('Button');
      expect(capitalizeFirst('loginForm')).toBe('LoginForm');
    });
  });

  describe('generateFileName', () => {
    it('should generate file name with default extension', () => {
      expect(generateFileName('Button')).toBe('Button.tsx');
    });

    it('should generate file name with custom extension', () => {
      expect(generateFileName('Button', 'jsx')).toBe('Button.jsx');
    });
  });
});
