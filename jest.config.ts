import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@jsverse)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

export default jestConfig;