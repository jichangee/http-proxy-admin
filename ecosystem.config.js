module.exports = {
  apps : [
      {
        name: "http-proxy-admin",
        script: "./server/index.js",
        watch: true,
        env: {
          "PORT": "",
        }
      }
  ]
}