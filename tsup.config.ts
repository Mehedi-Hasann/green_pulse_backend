import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  dts: false,
  clean: true,
  external: [
    // Prisma 7 internals - must stay external, resolved at runtime
    "@prisma/client",
    "@prisma/adapter-pg",
    "@prisma/client-runtime-utils",
    // All generated Prisma output - resolved at runtime
    "./src/generated/prisma",
    "../../generated/prisma",
  ],
  noExternal: [],
});