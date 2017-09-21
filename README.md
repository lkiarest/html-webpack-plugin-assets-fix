# html-webpack-plugin-assets-fix
Fix html-webpack-plugin [Issue](https://github.com/jantimon/html-webpack-plugin/issues/665) that the relative assets(js/css) paths are incorrect while building multiple entries. 

__Before importing this plugin for sub directory resolve, please try to modify your publicPath to be relative such as '../' and check it at first.__

### What's it
When you wanna generate multiple entry html files via webpack and release target files within different sub directories, generally you'll config as below:

```
module.exports = {
    entry: {
        a: 'a.js',
        b: 'b.js'
    },
    output: {
        path: 'your/dist/path',
        filename: '[name]/[name].[hash].js',
        publicPath: ''
    },
    plugins: [
        new HtmlWebpackPlugin({filename: 'a/index.html', chunks: ['a'], template: 'your/template/file/a'}),
        new HtmlWebpackPlugin({filename: 'b/index.html', chunks: ['b'], template: 'your/template/file/b'})
    ]
```

after build, the dist directory seems ok:
```
├── dist
│   ├── a
│   │   ├── index.html
│   │   └── a.xxxx.js
│   ├── b
│   │   ├── index.html
│   │   └── b.xxxx.js
```

but links of js/css files are incorrect in output html files, in 'a/index.html':
```
<script src='a/a.xxx.js'></script> <!-- wrong! -->
```
actually it should be:
```
<script src='a.xxx.js'></script> <!-- right! -->
```

This plugin is to fix the relative path of asset files in target html file.

### Usage

```
npm i html-webpack-plugin-assets-fix -D

// import this plugin in 'webpack.conf.js'
const HtmlWebpackPathAssetsFix = require('html-webpack-plugin-assets-fix')

//...
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'a/index.html', 
            chunks: ['a'], 
            template: 'your/template/file/a',
            fixAssets: true
        }),
        new HtmlWebpackPlugin({
            filename: 'b/index.html', 
            chunks: ['b'], 
            template: 'your/template/file/b',
            fixAssets: true
        }),
        new HtmlWebpackPathAssetsFix()
    ]
//...
```
