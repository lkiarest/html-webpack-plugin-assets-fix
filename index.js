/**
 * enhance of HtmlWebpackPlugin,
 * fix reference of js/css when build multi-entry files
 */

function HtmlWebpackPluginAssetsFix(options) {
    options = options || {}
    this.fixAssets = options.fixAssets
}

const TRIM_ARGS = [/^\.\//, /^\s*/, /\s*$/, /\/$/]

// clear path
function trim(path) {
    return TRIM_ARGS.reduce((ret, arg) => {
        ret = ret.replace(arg, '')
        return ret
    }, path)
}

function fixPath(assetPath, htmlPath) {
    assetPath = trim(assetPath)
    htmlPath = trim(htmlPath)

    //if asset is from cdn, ignore it
    if (assetPath.startsWith('//')) {
        return assetPath
    }

    if (assetPath.charAt(0) === '/') {
        assetPath = assetPath.substring(1)
    }

    let assetSegs = assetPath.split('/')
    const htmlSegs = htmlPath.split('/')

    let dupNum = 0
    for (let i = 0, len = htmlSegs.length; i < len; i++) {
        if (htmlSegs[i] === assetSegs[i]) {
            ++dupNum
        } else {
            break
        }
    }

    if (dupNum) {
        htmlSegs.splice(0, dupNum)
        assetSegs.splice(0, dupNum)
    }

    const htmlSize = htmlSegs.length
    if (htmlSize > 1) {
        const lpad = new Array(htmlSize - 1)
        lpad.fill('..')
        assetSegs = [...lpad, ...assetSegs]
    }

    return assetSegs.join('/')
}

HtmlWebpackPluginAssetsFix.prototype.apply = function(compiler) {
    const self = this

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, possiblyCallback) {
            const promise = new Promise((resolve, reject) => {
                const callback = possiblyCallback || ((err, res) => err ? reject(err) : resolve(res));
                if (!self.fixAssets) {
                    callback(null, htmlPluginData)
                    return;
                }

                const outputName = htmlPluginData.outputName
                const assets = htmlPluginData.assets
                const publicPath = assets.publicPath

                assets.js = assets.js.map(assetfile => {
                    return fixPath(assetfile.replace(publicPath, ''), outputName)
                })

                assets.css = assets.css.map(assetfile => {
                    return fixPath(assetfile.replace(publicPath, ''), outputName)
                })

                callback(null, htmlPluginData)
            });
            return possiblyCallback ? undefined : promise;
        })
    })
}

module.exports = HtmlWebpackPluginAssetsFix
