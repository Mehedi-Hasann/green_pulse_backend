export default {
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: true,
  external: [
    '@prisma/client',
    'prisma',
    '@prisma/client-runtime-utils',
  ],
};