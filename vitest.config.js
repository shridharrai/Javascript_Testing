import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true, // To clear all mocks before each test
  },
});
