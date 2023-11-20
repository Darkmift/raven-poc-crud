/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from '@jest/types';
import { resolve } from 'path';

// Sync object
const config: Config.InitialOptions = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/config',
        'src/app.js',
        'tests',
    ],
    roots: [resolve(__dirname)],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(t|j)sx?$': [
            'ts-jest',
            {
                tsconfig: {
                    baseUrl: './src',
                    paths: {
                        '@/*': ['./*'],
                    },
                },
            },
        ],
    },
};

export default config;
