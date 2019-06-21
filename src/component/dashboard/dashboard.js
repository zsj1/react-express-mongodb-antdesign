import React from "react";
import { connect } from "react-redux";
import { NavBar } from "antd-mobile";
import { Route, Redirect } from "react-router-dom";
import NavLinkBar from "../navlink/navlink";
import Boss from "../../component/boss/boss";
import Genius from "../../component/genius/genius";
import User from "../../component/user/user";
import Msg from "../../component/msg/msg";
import Question from "../../component/question/question"
import { getMsgList, recvMsg } from "../../redux/chat.redux";
import { getQueList, getMyQueList } from '../../redux/question.redux'
import {getInfo} from '../../redux/user.redux'
import QueueAnim from 'rc-queue-anim'

@connect(
  state => state,
  { getMsgList, recvMsg, getInfo, getQueList, getMyQueList }
)
class Dashboard extends React.Component {
  componentDidMount() {
    if (!this.props.user.user.length) {
      this.props.getInfo();
    }
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList();
      this.props.recvMsg();
    }
    if (!this.props.question.questions.length) {
      this.props.getQueList();
    }
    if (!this.props.question.myquestions.length) {
      this.props.getMyQueList();
    }
  }
  render() {
    const user = this.props.user;
    const { pathname } = this.props.location;
    const navList = [
      {
        path: "/boss",
        text: "牛人",
        icon: "job",
        title: "牛人列表",
        component: Boss,
        hide: user.type === "genius"
      },
      {
        path: "/genius",
        text: "boss",
        icon: "job",
        title: "BOSS列表",
        component: Genius,
        hide: user.type === "boss"
      },
      {
        path: "/questions",
        text: "问题讨论",
        icon: "boss",
        title: "问题专区",
        component: Question
      },
      {
        path: "/msg",
        text: "消息",
        icon: "msg",
        title: "消息列表",
        component: Msg
      },
      {
        path: "/me",
        text: "我",
        icon: "user",
        title: "个人中心",
        component: User
      }
    ];
    // return (
		// 	<div>
		// 		<NavBar className='fixd-header' mode='dard'>{navList.find(v=>v.path==pathname).title}</NavBar>
		// 		<div style={{marginTop:45}}>
		// 				<Switch>
		// 					{navList.map(v=>(
		// 						<Route key={v.path} path={v.path} component={v.component}></Route>
		// 					))}
		// 				</Switch>
		// 		</div>
		// 		<NavLinkBar data={navList}></NavLinkBar>
		// 	</div>
		// );
      const page = navList.find(v => v.path === pathname);
    // 让动画生效，只渲染一个route，根据当前的path决定组件
    return page?(
    	<div>
    		<NavBar className='fixd-header' mode='dard'>{navList.find(v=>v.path===pathname).title}</NavBar>
    		<div style={{marginTop:45, marginBottom: 55}}>
          <QueueAnim type='scaleX' duration={800}>
            <Route key={page.path} path={page.path} component={page.component}></Route>
          </QueueAnim>
        </div>
    		<NavLinkBar data={navList}></NavLinkBar>
    	</div>
    ) : <Redirect to="/login"></Redirect>
  }
}

export default Dashboard;
