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
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  moduleNameMapper: {},
  modulePathIgnorePatterns: [],
  reporters: ['default', 'jest-junit'],
  setupFilesAfterEnv: ['<rootDir>utility/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: false,
};
