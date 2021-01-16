module.exports = {
    devServer: {
        disableHostCheck: true,
        // public: 'eac32a87cdd5.ngrok.io'
    },
    chainWebpack: config => {
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
    }
}