module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  "transform": {
    "\\.js$": "<rootDir>/node_modules/babel-jest"
  },
};
