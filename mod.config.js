// Webpack configuration
module.exports = {
  base: {
    entry: {
      BrowserProgress: './src/index.js'
    },
    externals: {
      
    }
  },

  dev: {
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      host: 'localhost',
      port: 9000
    }
  },

  prod: {

  }
}