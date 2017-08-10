
export default {
  entry: './package/index.js',
  format: 'es',
  dest: './package/bundle/ngixstore.es5.js',
  sourceMap: true,
  external: id => ["@angular", "rxjs", "@ngrx", "@ngix"].reduce((p, c) => p || id.startsWith(c), false)
};
