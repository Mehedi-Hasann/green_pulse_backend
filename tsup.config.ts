import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  dts: false,
  clean: true,
  external: [
    // Prisma internals - must stay external, resolved at runtime
    "@prisma/client",
    "@prisma/adapter-pg",
  ],
  noExternal: [],
});