/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/lib/**/*.ts',
        'src/services/**/*.ts',
        '!src/scripts/**',
        '!**/*.d.ts',
    ],
    // Coverage threshold disabled for MVP (only 1 test file currently)
    // Enable when test suite is expanded to reach 70%+
};
