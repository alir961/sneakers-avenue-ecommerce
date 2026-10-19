/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/__tests__/globalSetup.ts',
    globalTeardown: '<rootDir>/__tests__/globalTeardown.ts',
    testMatch: ['**/__tests__/**/*.test.ts'],
    // sources import some modules with a ".js" suffix
    moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': '$1'},
};
