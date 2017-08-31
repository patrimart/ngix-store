
export default {
  entry: './package/index.js',
  format: 'umd',
  moduleName: '@ngix/store',
  dest: './package/bundle/ngixstore.umd.js',
  sourceMap: true,
  external: id => ["@angular", "rxjs", "@ngrx", "@reactivex"].reduce((p, c) => p || id.startsWith(c), false),
};
