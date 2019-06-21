import React from 'react'
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./container/login/login.js";
import AuthRoute from "./component/authroute/authroute.js";
import Register from "./container/register/register.js";
import BossInfo from "./container/bossinfo/bossinfo";
import GeniusInfo from "./container/geniusinfo/geniusinfo";
import Dashboard from "./component/dashboard/dashboard";
import Chat from './component/chat/chat'
import Post from './component/post/post'
import View from './component/view/view'
import Reply from './component/reply/reply'
import MyQuestion from './component/myquestion/myquestion'
import Manage from './component/admin/manage'
import Info from './component/admin/info'
class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     hasError: false 
  //   }
  // }
  // componentDidCatch(err, info) {
  //   // console.log(err);
  //   this.setState({
  //     hasError: true
  //   })
  // }
  render() {
      // return this.state.hasError? <Redirect to='/login'></Redirect>:(
      return (
      <div>
          <AuthRoute />
          <Switch>
            <Route path="/bossinfo" component={BossInfo} />
            <Route path="/geniusinfo" component={GeniusInfo} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/chat/:user" component={Chat} />
            <Route path="/question/:questionid" component={View} />
            <Route path="/reply/:questionid" component={Reply} />
            <Route path="/post" component={Post} />
            <Route path="/myquestion" component={MyQuestion} />
            <Route path="/manage" component={Manage} />
            <Route path="/info" component={Info} />
            <Route component={Dashboard} />
          </Switch>
        </div>
      )
  }
}

export default App;
