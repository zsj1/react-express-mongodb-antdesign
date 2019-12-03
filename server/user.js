const express = require("express");
const utils = require("utility");
const fs = require("fs");
const Router = express.Router();
const model = require("./model");
const User = model.getModel("user");
const Chat = model.getModel("chat");
const Question = model.getModel("question");
const Reply = model.getModel("reply");
const _filter = { pwd: 0, __v: 0 };

Router.get("/getqueslist", function(req, res){
  // Question.remove({},function(e,d){})
  User.find({}, function(err, doc) {
    let users = {};
    doc.forEach(v => {
      users[v._id] = {
        name: v.user,
        avatar: v.avatar,
        type: v.type
      };
    });
    Question.find({}, function(err, doc) {
      if (!err) {
        return res.json({ code: 0, questions: doc, users: users });
      }
    });
  });
})
Router.get("/getmyqueslist", function(req, res){
  const userid = req.cookies.userid;
  if (!userid) {
    return res.json({ code: 1, msg:"处理过程出错" });
  }
  Question.find({author: userid}, function(err, doc) {
    if (!err) {
      return res.json({ code: 0, myquestions: doc, });
    }
  });
})
Router.post("/getreplylist", function(req, res){
  const { questionid } = req.body;
  Reply.find({questionid: questionid}, function(err, doc) {
    return res.json({ code: 0, replys: doc });
  })
})
Router.post("/readque", function(req, res){
  const userid = req.cookies.userid;
  const { questionid } = req.body;
  Question.update(
    {_id: questionid}, 
    {'$set': {isnew: false}},
    // {'multi': true},
    function(err, doc){
      // console.log(doc);
      if (!err) {
        Question.find({author: userid}, function(err, doc) {
          if (!err) {
            return res.json({ code: 0, myquestions: doc, });
          }
        });
      }
  })
})
Router.post("/replyque", function(req, res){
  const userid = req.cookies.userid;
  const { content, questionid, replysnum } = req.body;
  // console.log(content, questionid, replysnum)
  if (!userid) {
    return res.json({ code: 1, msg:"处理过程出错" });
  }
  Reply.create(
    { content: content, replier: userid, reply_time: new Date(), questionid: questionid}, function(err, doc) {
      if (!err) {
        // console.log(doc);
        Question.update(
          {_id: questionid}, 
          {'$set': {isnew: true, replysnum: replysnum + 1, update_time: new Date() }},
          // {'multi': true},
          function(err, doc){
            // console.log(doc);
            if (!err) {
              Reply.find({questionid: questionid}, function(err, doc){
                if (!err) {
                  // console.log(doc);
                  return res.json({code: 0, replys: doc});
                }
              })
            }
        })
      }
    }
  )
})
Router.post("/postques", function(req, res){
  const userid = req.cookies.userid;
  if (!userid) {
    return res.json({ code: 1, msg:"处理过程出错" });
  }
  fs.stat("../image/" + userid, function(err, stat) {
    if (!(stat && stat.isDirectory())) {
      fs.mkdir("../image/" + userid, function(err) {});
    }
  });
  const { image, question, addition } = req.body;
  if (image.length > 0) {
    const path = `../image/${userid}/`;
    let buffer = Buffer.from(image[0].imgData, "base64");
    fs.writeFile(path + image[0].imgName, buffer,  function(err) {
      if (err) {
        console.log("处理过程出错！");
        return res.json({ code: 1, msg:"图片处理过程出错" });
      }
      console.log("数据写入成功！");
    });
  }
  Question.create(
    { author: userid, question: question, addition: addition, image: image.length > 0 ? image[0].imgName : "", create_time: new Date(), update_time: new Date()},
    function(err, doc) {
      if (!err) {
        return res.json({ code: 0, data: doc });
      }
    }
  );
})

Router.get("/list", function(req, res) {
  const { type } = req.query;
  // Chat.remove({},function(e,d){})
  User.find({ type }, function(err, doc) {
    return res.json({ code: 0, data: doc });
  });
});
Router.get("/getmsglist", function(req, res) {
  const userid = req.cookies.userid;
  // console.log(userid);
  User.find({}, function(err, doc) {
    let users = {};
    doc.forEach(v => {
      users[v._id] = {
        name: v.user,
        avatar: v.avatar
      };
    });
    Chat.find({'$or': [{from: userid}, {to: userid }]}, function(err, doc) {
      if (!err) {
        return res.json({ code: 0, msgs: doc, users: users });
      }
    });
  });
});
Router.post('/readmsg', function(req, res) {
  const userid = req.cookies.userid;
  const {from} = req.body;
  Chat.updateMany(
    {from, to: userid}, 
    {'$set': {read: true}},
    // {'multi': true},
    function(err, doc){
      // console.log(doc);
      if (!err) {
        return res.json({code: 0, num: doc.nModified});
      }
      return res.json({code: 1, msg: '修改失败'});
    })
})
Router.post("/update", function(req, res) {
  const userid = req.cookies.userid;
  if (!userid) {
    return res.json({ code: 1 });
  }
  const body = req.body;
  for (let e in body) {
    if (typeof(body[e]) === 'undefined' || body[e] === null || body[e].length === 0) {
      delete body[e];
    }
  }
  User.findByIdAndUpdate(userid, body, function(err, doc) {
    // const data = Object.assign(
    //   {},
    //   {
    //     user: doc.user,
    //     type: doc.type
    //   },
    //   body
    // );
    User.findOne({ user: doc.user }, _filter, function(err, dd) {
      // console.log(dd);
      if (!dd) {
        return res.json({ code: 1, msg: "用户名不存在" });
      }
      return res.json({ code: 0, data: dd });
    });
  });
});
Router.post("/login", function(req, res) {
  const { user, pwd } = req.body;
  User.findOne({ user: user, pwd: md5Pwd(pwd) }, _filter, function(err, doc) {
    if (!doc) {
      return res.json({ code: 1, msg: "用户名不存在或密码错误" });
    }
    res.cookie("userid", doc._id);
    return res.json({ code: 0, data: doc });
  });
});

Router.post("/register", function(req, res) {
  const { user, pwd, type } = req.body;
  User.findOne({ user: user }, function(err, doc) {
    if (doc) {
      return res.json({ code: 1, msg: "用户名重复" });
    }
    const userModel = new User({ user, type, pwd: md5Pwd(pwd) });
    userModel.save(function(err, doc) {
      if (err) {
        return res.json({ code: 1, msg: "后端出错了" });
      }
      const { user, type, _id } = doc;
      res.cookie("userid", _id);
      return res.json({ code: 0, data: { user, type, _id } });
    });
  });
});
Router.get("/info", function(req, res) {
  const { userid } = req.cookies;
  // 用户有没有cookie
  if (!userid) {
    return res.json({ code: 1 });
  }
  User.findOne({ _id: userid }, _filter, function(err, doc) {
    if (err) {
      return res.json({ code: 1, msg: "后端出错了" });
    }
    if (doc) {
      return res.json({ code: 0, data: doc});
    }
  });
});

function md5Pwd(pwd) {
  const salt = "imooc_is_good_3957x8yza6!@#IUHJh~~";
  return utils.md5(utils.md5(pwd + salt));
}

module.exports = Router;
