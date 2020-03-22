module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "devServer": {
    "proxy": {
      "^/api": {
        "target": "http://localhost:3001"
      },
      "^/socket": {
        "target": "http://localhost:3000"
      }
    }
  },
}