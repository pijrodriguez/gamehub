const webpack = require("webpack");
const path = require("path");

var jF = path.resolve(__dirname, "js");
var bF = path.resolve(__dirname, "build");

var config = {
    entry:{
        "main":jF+"/myjs.js",
        "topics":jF+"/topics.js",
        "room":jF+"/room.js",
        "profile":jF+"/profile.js"
    },
    output:{
        filename:"[name]bundle.js",
        path:bF
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery"
        })
    ]
};

module.exports = config;