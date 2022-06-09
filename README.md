<div align="center">
  <h1>Http Proxy Admin</h1>
</div>

<div align="center">
📦 开箱即用，一个简易的http请求转发控制面板，依赖express和http-proxy-middleware
</div>

# 启动前
```bash
# 依赖pm2
npm i -g pm2

npm run build
```

# 启动
```bash
npm start
或者
yarn start

# 面板服务运行在 http://localhost:30000/app/
# 代理服务运行在 http://localhost:30000/proxy/
# 接口服务运行在 http://localhost:30000/api/
```