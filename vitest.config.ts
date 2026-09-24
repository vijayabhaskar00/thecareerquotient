import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    // Multi-field forms with Select interactions run noticeably slower
    // under full-suite parallel load than in isolation; the 5s default
    // was causing spurious timeouts, not real hangs.
    testTimeout: 15000,
  },
});
