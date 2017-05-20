/**
 * enhance of HtmlWebpackPlugin,
 * fix reference of js/css when build multi-entry files
 */

function HtmlWebpackPluginAssetsFix(options) {
    options = options || {}
    this.fixAssets = options.fixAssets
}

function fixPath(assertPath, htmlPath) {
    if (!assertPath || !htmlPath) {
        return assertPath
    }

    let segments = htmlPath.split('/')
    do {
        if (segments.length === 0) {
            break
        }

        let seg = segments.shift() + '/'
        if (assertPath.indexOf(seg ) === 0) {
            assertPath = assertPath.replace(seg, '')
        } else {
            break
        }
    } while (true)

    return assertPath
}

HtmlWebpackPluginAssetsFix.prototype.apply = function(compiler) {
    const self = this

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            if (!self.fixAssets) {
                callback(null, htmlPluginData)
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
        })
    })
}

module.exports = HtmlWebpackPluginAssetsFix
