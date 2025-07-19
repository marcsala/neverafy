const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['food-alert-mvp.tsx'],
  bundle: true,
  outfile: 'food-alert-mvp.js',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
}).catch(() => process.exit(1));
