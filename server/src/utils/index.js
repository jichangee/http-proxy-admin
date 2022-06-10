const fs = require('fs')
const path = require('path')
const dbPath = path.resolve(__dirname, '../db.json')
const defaultProxyConfig = {
  "port": 30000,
  "list": []
}
console.log('dbPath', dbPath)
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
  dbPath,
  getProxyConfig,
  setProxyConfig,
  defaultProxyConfig
}