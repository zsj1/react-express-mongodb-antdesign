import React from "react"
import { connect } from "react-redux"
import browserCookie from 'browser-cookies'
import { Result, List, WhiteSpace, Button, Modal, Badge, PullToRefresh} from "antd-mobile"
import {logoutSubmit, updateRedirect} from '../../redux/user.redux'
import {eraseMsg} from '../../redux/chat.redux'
import {eraseQues, getMyQueList} from '../../redux/question.redux'
import {Redirect} from 'react-router-dom'

@connect(
  state => state,
  {logoutSubmit, updateRedirect, eraseMsg, eraseQues, getMyQueList}
)
class User extends React.Component{
  constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
		}
		this.logout = this.logout.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
    if (!this.props.question.myquestions.length) {
      this.props.getMyQueList();
    }
  }
  logout() {
		const alert = Modal.alert;
		alert('注销', '确认退出登录吗?', [
		      { text: '取消', onPress: () => null },
		      { text: '确认', onPress: () => {
						browserCookie.erase('userid');
						this.props.eraseMsg();
						this.props.eraseQues();
		      	this.props.logoutSubmit();
		      }}
		    ])
	}
	handleClick() {
		this.props.updateRedirect();
		// console.log(`/${this.props.type}info`);
    this.props.history.push(`/${this.props.user.type}info`);
  }
  render(){
		const Item = List.Item;
		const Brief = Item.Brief;
		let replynums = 0;
		if ( this.props.question.myquestions.length > 0) {
			replynums = this.props.question.myquestions.filter(v => v.isnew === true).length
		}
		return this.props.user.user?(
			<div>
				<PullToRefresh
            damping={60}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              setTimeout(() => {
                this.props.getMyQueList();
                this.setState({ refreshing: false });
              }, 1000);
            }}
				>
					<Result
						img={<img src={require(`../img/${this.props.user.avatar}.png`)} style={{width:50}} alt="" />}
						title={this.props.user.user}
						message={this.props.user.type==='boss'?this.props.user.company:null}
					/>
					<List renderHeader={()=>'简介'}>
						<Item
							multipleLine
						>
							{this.props.user.title}
							{this.props.user.desc.split('\n').map(v=><Brief key={v}>{v}</Brief>)}
							{this.props.user.money?<Brief>薪资:{this.props.user.money}</Brief>:null}
						</Item>
					</List>
					<WhiteSpace></WhiteSpace>
					<Button onClick={this.logout}>注销</Button>  
					<WhiteSpace></WhiteSpace>
					<Button type="ghost" onClick={() => {
						this.props.getMyQueList();
						this.props.history.push('/myquestion')
					}}>{ replynums  > 0 ? (<div>我的问题<Badge text={'new'} style={{ marginLeft: 12 }} /></div> ) : <div>我的问题</div> }</Button>
					
					<WhiteSpace></WhiteSpace>
					<Button type="primary" onClick={this.handleClick}>更改信息</Button>
				</PullToRefresh>
			</div>
			) : <Redirect to={this.props.user.redirectTo} />
  }
}

export default User;
