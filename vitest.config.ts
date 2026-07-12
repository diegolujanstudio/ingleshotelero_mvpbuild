import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest config for pure-logic unit tests (WhatsApp engine, scoring math,
 * CEFR bucketing, SM-2, streak, etc.).
 *
 * Tests must import ONLY pure modules — anything that pulls `import "server-only"`
 * throws outside the Next runtime, so keep engine/algorithm code free of it and
 * test that. Node environment (no jsdom) keeps the suite fast.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
});
