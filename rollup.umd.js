
export default {
  entry: './package/index.js',
  format: 'umd',
  moduleName: '@ngix/store',
  dest: './package/bundle/ngixstore.umd.js',
  sourceMap: true,
  external: id => ["@angular", "rxjs", "@ngrx", "@ngix"].reduce((p, c) => p || id.startsWith(c), false),
};

// module.exports = {
//     context: __dirname,
//     entry: "./package/index.js",
//     output: {
//         path: __dirname + "/package/bundle",
//         filename: "ngixstore.umd.js",
//         library: "@ngix/store",
//         libraryTarget: "umd"
//     },
//     externals: [
//         {
//             library: true,
//         },
//         /\@angular\/.+/,
//         /rxjs\/.+/,
//         /\@ngrx\/.+/,
//         /\@ngix\/.+/
//     ],
//     target: "web"
// };
