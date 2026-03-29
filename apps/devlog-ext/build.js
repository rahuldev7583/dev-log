require('esbuild').build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  external: ['vscode'], 
}).catch(() => process.exit(1));