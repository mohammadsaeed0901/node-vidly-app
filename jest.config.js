module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverage: true,
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};