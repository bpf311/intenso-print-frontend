const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.ELECTRON === true ? './' : '',
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      preload: 'electron/preload.js'
    }
  }
})
