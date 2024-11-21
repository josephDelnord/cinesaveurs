export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
};
