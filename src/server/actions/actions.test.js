import { checkAgainstValue } from './actions';

describe('actions', () => {
  [
    // Basic operations
    ['value < reading', 5, 7, true],
    ['value > reading', 5, 7, false],
    ['value <= reading', 5, 7, true],
    ['value <= reading', 5, 5, true],
    ['value >= reading', 5, 7, false],
    ['value >= reading', 5, 5, true],
    ['value === reading', 5, 7, false],
    ['value === reading', 5, 5, true],
    ['value !== reading', 5, 7, true],
    ['value !== reading', 5, 5, false],
    // Ands and Ors
    ['value === reading && value > reading', 5, 7, false],
    ['value === reading || value > reading', 5, 7, false],
    ['value === reading || value > reading', 7, 5, true],
    // Constants
    ['value === reading && reading > 10', 5, 7, false],
    ['value !== reading && value > 5', 5, 7, false],
  ].forEach(([expression, value, reading, result]) => {
    it(`should test ${expression
      .replace(/value/g, value)
      .replace(/reading/g, reading)} is ${result}`, () => {
      expect(checkAgainstValue(expression, value, reading)).toBe(result);
    });
  });
});
