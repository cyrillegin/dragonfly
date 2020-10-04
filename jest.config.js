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
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {},
  modulePathIgnorePatterns: [],
  reporters: ['default', 'jest-junit'],
  setupFilesAfterEnv: ['<rootDir>utility/setupTests.js'],
  verbose: false,
};
