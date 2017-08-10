
export default {
  entry: './package/index.js',
  format: 'umd',
  moduleName: '@ngix/store',
  dest: './package/bundle/ngixstore.umd.js',
  sourceMap: true,
  external: id => ["@angular", "rxjs", "@ngrx", "@ngix"].reduce((p, c) => p || id.startsWith(c), false),
};
