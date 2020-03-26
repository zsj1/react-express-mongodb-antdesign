`npm install`

使用该命令安装所有需要的工具包

`npm start`

使用该命令启动项目

`mongodb配置`

mongodb的配置在server/model.js中

`其他说明`

当前部署在服务器上项目有一定bug还未修复，将打包好的dist丢给express用pm2跑起来了，导致了上传图片和socket.io聊天的交互都失效了，猜测造成原因可能是没采用正规的前后端分离部署，后续会进行修复。
