import React from "react";
import { connect } from "react-redux";
import { NavBar, List, Card, WhiteSpace, TextareaItem, Toast } from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {replyQue, getQueList, getReplyList} from '../../redux/question.redux'

@connect(
  state => state,
  {replyQue, getQueList, getReplyList}
)
class Reply extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ""
    }
  }
  onChange(key,val){
		this.setState({
			[key]:val
    })
  }
  onSubmit(){
    if (!this.state.content.length) {
      Toast.fail('请输入回答后再发布', 1);
    } else {
      Toast.success(`回答成功`, 1);
      this.props.replyQue({
        questionid: this.props.match.params.questionid,
        replysnum: this.props.location.query.replysnum,
        content: this.state.content
      })
      this.props.history.push(`/question/${this.props.match.params.questionid}`);
    }
  }
  componentWillUnmount() {
    this.props.getQueList();
    this.props.getReplyList({questionid: this.props.match.params.questionid});
  }
  render() {
    const Item = List.Item;
    const Body = Card.Body;
    return this.props.location.query ? (
      <div>
        <NavBar 
          className="fixd-header"
          mode='drak'
          leftContent={<span>取消</span>}
          rightContent={<a onClick={() => this.onSubmit()} style={{color: "#FFF"}}>发布</a>}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        ></NavBar>
        <div style={{marginTop: 45}}>
          <Card>
            <Body>
              <div style={{fontSize:18}}>
                {this.props.location.query.question.split('\n').map(d=>(
                  <span key={d}><strong>{d}</strong></span>
                ))}
              </div>
            </Body>
          </Card>
          <WhiteSpace></WhiteSpace>
          <List>
            <Item>
              <TextareaItem
                autoHeight
                rows={15}
                onChange={(v)=>this.onChange('content',v)}
                placeholder="填写回答内容"
              />
            </Item>
          </List>
        </div>
      </div>
          
    ) : <Redirect to={`/question/${this.props.match.params.questionid}`} />;
  }
}

export default Reply
