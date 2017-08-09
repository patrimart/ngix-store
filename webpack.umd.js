
module.exports = {
    context: __dirname,
    entry: "./package/index.js",
    output: {
        path: __dirname + "/package/bundle",
        filename: "ngixstore.umd.js",
        library: "@ngix/store",
        libraryTarget: "umd"
    },
    externals: [
        {
            library: true,
        },
        /\@angular\/.+/,
        /rxjs\/.+/,
        /\@ngrx\/.+/,
        /\@ngix\/.+/
    ],
    target: "web"
};
