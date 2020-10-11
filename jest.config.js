module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    '!**/__snapshots__/**',
    '!**/dist/**',
    '!**/node_modules/**',
    'src/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  moduleNameMapper: {},
  modulePathIgnorePatterns: [],
  reporters: ['default', 'jest-junit'],
  setupFilesAfterEnv: ['<rootDir>utility/setupTests.js'],
  verbose: false,
};
