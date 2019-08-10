module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'tests/.*\\.test.ts',
  transform: {
    '.ts': 'ts-jest'
  },
  modulePaths: [
    '<rootDir>/src'
  ],
  moduleFileExtensions: ['ts', 'js']
}
