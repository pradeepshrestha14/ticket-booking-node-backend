import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 1,
  testMatch: ["**/tests/**/*.test.ts"],

  clearMocks: true,
  restoreMocks: true,

  collectCoverage: true,
  coverageDirectory: "coverage",

  coverageReporters: ["text", "html", "lcov"],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts", // bootstrap only
    "!src/app.ts", // wiring only
    "!src/db/**", // Prisma client
    "!src/generated/**",
    "!**/*.d.ts",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};

export default config;
