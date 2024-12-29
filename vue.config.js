const { defineConfig } = require('@vue/cli-service');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = defineConfig({
    transpileDependencies: true,
    css: {
        extract: true,
    },
    chainWebpack: (config) => {
        // Add MiniCssExtractPlugin if not already defined
        config.plugin('mini-css-extract').use(MiniCssExtractPlugin, [
            {
                filename: '[name].[contenthash].css',
                chunkFilename: '[name].[contenthash].css',
            },
        ]);
    },
});
