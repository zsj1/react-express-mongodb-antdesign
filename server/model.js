const mongoose = require("mongoose");

// 连接mongo 并且使用immoc-chat这个集合
const DB_URL = "mongodb://localhost:27017/imooc-chat";
mongoose.connect(DB_URL, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
const models = {
  user: {
    // 用户名
    user: { type: String, require: true },
    // 密码
    pwd: { type: String, require: true },
    // 用户类型
    type: { type: String, require: true },
    // 头像
    avatar: { type: String },
    // 个人简介
    desc: { type: String },
    // 职位名 or 招聘名
    title: { type: String },
    // 如果你是BOSS 还有两个字段 公司和薪资
    company: { type: String },
    money: { type: String }
  },
  chat: {
    // 用于chat分组的id
    chatid: {type: String, require: true},
    // 发送者id
    from: {type: String, require: true},
    // 接收者id
    to: {type: String, require: true},
    // 是否被读取
    read: {type: Boolean, default: false},
    // 消息内容
    content: {type: String, require: true, default:''},
    // 发送时间
    create_time: {type:Number}
  },
  question: {
    // 发布者id
    author: {type: String, require: true},
    // 问题
    question: {type: String, require: true},
    // 问题补充信息
    addition: {type: String},
    // 问题补充图片
    image: {type: String},
    // 回复数
    replysnum: {type: Number, default: 0},
    // 是否有新的回复
    isnew: {type: Boolean, default: false},
    // 审核状态
    state: {type: Number, default: 0},
    // 发布时间
    create_time: {type:Number},
    // 更新时间
    update_time: {type:Number}
  },
  reply: {
    // 问题id
    questionid: {type: String, require: true},
    // 回复者id
    replier: {type: String, require: true},
    // 回复内容
    content: {type: String, require: true},
    // 回复时间
    reply_time: {type:Number}
  }
};

for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]));
}

module.exports = {
  getModel: function(name) {
    return mongoose.model(name);
  }
};
