const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const model = require("./model");
const path = require("path");


// import csshook from 'css-modules-require-hook/preset'
// import assethook from 'asset-require-hook'
// assethook({
//   extensions:['png']
// })
// import React from 'react';
// import thunk from "redux-thunk";
// import { StaticRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { createStore, applyMiddleware, compose } from "redux";
// import App from '../src/app';
// import reducers from "../src/reducer";
// import { renderToString } from 'react-dom/server';
// import staticPath from '../build/asset-manifest.json';
// console.log(staticPath);
// React组件=>div
// function App() {
//   return (
//     <div>
//       <p>server render</p>
//       <p>imooc rocks</p>
//     </div>
//   )
// }
// console.log(renderToString(<App></App>))
// 新建app
const app = express();
// work with express
const server = require("http").Server(app);
const io = require("socket.io")(server);
const Chat = model.getModel("chat");

io.on("connection", function(socket) {
  socket.on("sendmsg", function(data) {
    const { from, to, msg } = data;
    const chatid = [from, to].sort().join("_");
    Chat.create(
      { chatid, from, to, content: msg, create_time: new Date() },
      function(err, doc) {
        io.emit("recvmsg", Object.assign({}, doc._doc));
      }
    );
  });
});

const userRouter = require("./user");
const adminRouter = require("./admin");

app.use(cookieParser());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// 路由定义必须在配置之后
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use(function(req, res, next) {
  if (req.url.startsWith("/user/") || req.url.startsWith("/static/") || req.url.startsWith("/admin/") ) {
    return next();
  }
  return res.sendFile(path.resolve("build/index.html"));
});
app.use("/", express.static(path.resolve("build")));
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
server.listen(9093, function() {
  console.log("Node app start at port 9093");
});
