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
    coverageThreshold: {
        global: {
            branches: 20,
            functions: 20,
            lines: 20,
            statements: 20,
        },
    },
};
