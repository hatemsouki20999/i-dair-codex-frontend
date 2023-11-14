import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  transform: { "^.+\\.ts?$": "ts-jest", "^.+\\.tsx$": "ts-jest" },
  moduleNameMapper: {
    ".+\\.(css|png|png|jpg)$": "identity-obj-proxy",
  },
  /*coverageReporters: [
    "text",
    "cobertura",
  ],*/

  coveragePathIgnorePatterns: [
    'src/utils/.*',
    'src/services/.*',
    'src/interfaces/.*',
    'src/styles/.*',
    'src/redux/reducers/.*',
    'src/redux/store/.*',
    'src/components/tests/unit tests/.*',
    'src/translation/en/.*'
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    features: {
      webgl: true,
    },
  },
  setupFiles: ["<rootDir>/src/components/tests/unit tests/jest.stub.js"],
};

export default config;
