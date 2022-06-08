const fs = require('fs')
const dbPath = './db.json'
const defaultProxyConfig = {
  "port": 3000,
  "list": []
}
const getProxyConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath).toString())
  } catch (error) {
    return defaultProxyConfig
  }
}
const setProxyConfig = (proxyConfig = defaultProxyConfig) => {
  console.log('proxyConfig', proxyConfig)
  fs.writeFileSync(dbPath, JSON.stringify(proxyConfig), (err) => {
    if (err) {
      console.log('err', err)
    }
  })
}

module.exports = {
  getProxyConfig,
  setProxyConfig,
  defaultProxyConfig
}