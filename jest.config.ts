// Jest config as per https://dev.to/mangadev/set-up-a-backend-nodejs-typescript-jest-using-es-modules-1530

import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.ts",
    "!src/**/*.test.js", // Exclude test files
  ],
  coverageReporters: ["json", "lcov", "text", "clover"],
};

export default config;
