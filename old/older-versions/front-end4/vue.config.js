module.exports = {
  "devServer": {
    "proxy": {
      "^/api": {
        "target": "https://localhost:3002"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}