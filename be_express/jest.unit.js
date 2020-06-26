module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // **/*.spec.ts
  testRegex: '(\\.|/)(spec)\\.[jt]sx?$',
  testPathIgnorePatterns: ['/node_modules/'],
}
