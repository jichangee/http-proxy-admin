const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const { api } = require("./src/routes/api");
const proxyConfig = JSON.parse(fs.readFileSync("./db.json").toString());
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/api", api);

proxyConfig.list.forEach((item) => {
  app.use(
    "/proxy" + item.path,
    createProxyMiddleware({
      target: item.target,
      changeOrigin: true,
      pathRewrite: { "^/proxy": "" },
    })
  );
});

app.listen(proxyConfig.port);

console.log(`Proxy server is running on  http://localhost:${proxyConfig.port}`);
