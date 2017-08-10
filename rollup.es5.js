
export default {
  entry: './package/index.js',
  format: 'es',
  dest: './package/bundle/ngixstore.es5.js',
  sourceMap: true,
  external: id => ["@angular", "rxjs", "@ngrx", "@ngix"].reduce((p, c) => p || id.startsWith(c), false)
};

// module.exports = {
//     context: __dirname,
//     entry: "./package/index.js",
//     output: {
//         path: __dirname + "/package/bundle",
//         filename: "ngixstore.es5.js",
//         library: "@ngix/store",
//         libraryTarget: "es2015"
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
