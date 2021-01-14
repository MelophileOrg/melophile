module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb',
    '@nuxtjs',
  ],
  plugins: [
  ],
  rules: {
    'comma-dangle': 'off',
    'semi': 'off',
  },
}
