const express = require("express");
const Router = express.Router();
const model = require("./model");
const Question = model.getModel("question");

Router.post("/reviewque", function(req, res){
    const { questionid, act } = req.body;
    const setState = act === '通过' ? 1 : 2;
    Question.update(
      {_id: questionid}, 
      {'$set': {state: setState}},
      // {'multi': true},
      function(err, doc){
        return res.json({ code: 0});
    })
})

module.exports = Router;