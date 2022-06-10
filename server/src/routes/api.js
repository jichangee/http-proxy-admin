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
  proxyConfig.list = proxyConfig.list.filter(item => `${item.id}` !== req.params.id)
  setProxyConfig(proxyConfig)
  res.status(200).json(proxyConfig.list)
})

api.put('/:id', async (req, res) => {
  const body = req.body
  const proxyConfig = getProxyConfig()
  const index = proxyConfig.list.findIndex(item => `${item.id}` === req.params.id)
  if (index === -1) {
    return res.status(400).json({ message: 'id is not found' })
  }
  const updatedItem = {
    ...proxyConfig.list[index],
    ...body
  }
  proxyConfig.list.splice(index, 1, updatedItem)
  setProxyConfig(proxyConfig)
  res.status(200).json(updatedItem)
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