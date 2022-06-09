const { Router } = require('express')
const { nanoid } = require('nanoid')
const { getProxyConfig, setProxyConfig, defaultProxyConfig } = require('../utils')
const fs = require('fs')
const api = Router()

api.get('/list', async (req, res) => {
  const proxyConfig = getProxyConfig()
  res.status(200).json(proxyConfig.list)
})

api.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'id is required' })
  }
  const proxyConfig = getProxyConfig()
  proxyConfig.list = proxyConfig.list.filter(item => item.id !== req.params.id)
  setProxyConfig(proxyConfig)
  res.status(200).json(proxyConfig.list)
})

api.post('/reset', async (req, res) => {
  setProxyConfig()
  res.status(200).json(defaultProxyConfig.list)
})

api.post('/create', async (req, res) => {
  const { path, target } = req.body
  if (!path || !target) {
    return res.status(400).json({ message: 'path and target is required' })
  }
  const proxyConfig = getProxyConfig()

  if (proxyConfig.list.some(item => item.path === path)) {
    return res.status(400).json({ message: 'path is already exist' })
  }

  const item = {
    id: nanoid(),
    path,
    target
  }
  if (item.path === '/') {
    proxyConfig.list = proxyConfig.list.concat([item])
  } else {
    proxyConfig.list = [item].concat(proxyConfig.list)
  }
  
  setProxyConfig(proxyConfig)
  res.status(200).json(proxyConfig.list)
})

module.exports = {
  api
}