import React from "react";
import { connect } from "react-redux";
import { List, Badge } from "antd-mobile";

@connect(state => state)
class Msg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentId: 0,
    }
  }
  getLast(arr) {
    return arr[arr.length - 1];
  }
  render() {
    const Item = List.Item;
    const Brief = List.Item.Brief;
    const userid = this.props.user._id;
    const userinfo = this.props.chat.users;
    // 按照聊天用户分组，根据chatid
    const msgGroup = {};
    this.props.chat.chatmsg.forEach(v => {
      msgGroup[v.chatid] = msgGroup[v.chatid] || [];
      msgGroup[v.chatid].push(v);
    });

    const chatList = Object.values(msgGroup).sort((a, b) => {
      const a_last = this.getLast(a).create_time;
      const b_last = this.getLast(b).create_time;
      return b_last - a_last;
    })
    // console.log(chatList)
    return (
      <div>
        {chatList.map(v => {
          const lastItem = this.getLast(v);
          // 取另一个用户
          if (v[0].from !== userid && v[0].to !== userid) {
            return null;
          }
          const targetId = v[0].from === userid ? v[0].to : v[0].from;
          if (!userinfo[targetId]) {
            return null;
          }
          const name = userinfo[targetId] ? userinfo[targetId].name : "";
          const avatar = userinfo[targetId] ? userinfo[targetId].avatar : "";
          const unreadNum = v.filter(v => !v.read && v.to === userid).length;
          return (
              <List key={lastItem._id}>
                <Item 
                  extra={<Badge text={unreadNum}></Badge>}
                  thumb={require(`../img/${avatar}.png`)}
                  arrow="horizontal"
                  multipleLine
                  onClick={() => {
                    this.props.history.push(`/chat/${targetId}`);
                  }}
                >
                  {lastItem.content}
                  <Brief>{name}</Brief>
                </Item>
              </List>
          );
        })}
      </div>
    );
  }
}

export default Msg;
