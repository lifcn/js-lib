process.env.MOCK_API_PORT = process.env.MOCK_API_PORT || 9000

module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'tests/.*\\.test.ts',
  transform: {
    '.ts': 'ts-jest'
  },
  modulePaths: [
    '<rootDir>/src'
  ],
  testURL: 'http://localhost:' + process.env.MOCK_API_PORT,
  moduleFileExtensions: ['ts', 'js']
}
