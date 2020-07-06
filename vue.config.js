module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:4000',
      },
      // '^/graphql': {
      //   target: 'http://localhost:3000',
      // },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { modules: true },
            },
            'sass-loader',
          ],
        },
      ],
    },
  },
};
