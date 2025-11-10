// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = (app) => {
  app.use(
    ["/api"],                      // พอแล้ว ใช้แค่ /api
    createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true })
  );
};
