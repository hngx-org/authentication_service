module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  module: 'ESNext', // or 'commonjs' based on your needs
  extensionsToTreatAsEsm: ['.ts'],
  // ... other configurations
};
