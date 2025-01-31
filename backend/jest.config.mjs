export default {
  transform: {
    "^.+\\.(js|jsx|mjs)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-es6-package-to-transform).*/"
  ],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
