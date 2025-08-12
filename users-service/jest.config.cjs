module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@database/(.*)$": "<rootDir>/src/database/$1",
    "^@service/(.*)$": "<rootDir>/src/service/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   testMatch: [
//     "**/test/unit/**/*.test.ts",
//     "**/test/integration/**/*.test.ts",
//     "**/test/e2e/**/*.test.ts",
//   ],
//   moduleNameMapper: {
//     "^@src/(.*)$": "<rootDir>/src/$1",
//     "^@test/(.*)$": "<rootDir>/test/$1",
//     "^../src/config/knex/knexfile.js$": "<rootDir>/src/config/knex/knexfile.ts",
//   },
//   transform: {
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         tsconfig: "tsconfig.json",
//         isolatedModules: true,
//       },
//     ],
//   },
//   setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
//   testTimeout: 30000,
// };
