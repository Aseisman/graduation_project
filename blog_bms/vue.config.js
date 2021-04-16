const path = require('path');

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    publicPath: './', // 设置打包文件相对路径
    devServer: {
        // open: true,
        // host: localhost,
        // https: false,
        // path
        // assetsSubDirectory: "static",
        // assetsPublicPath: "/",
        // 本地代理
        proxy: {
            "/apis": {
                // target: "http://129.28.152.92:8080", //设置你调用的接口域名和端口号 别忘了加http
                target:"http://localhost:5000",
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    "^/apis": "" //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@i': path.resolve(__dirname, './src/assets'),
            }
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            // 下面是下载的插件的配置
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100
            })
        ]
    }
}