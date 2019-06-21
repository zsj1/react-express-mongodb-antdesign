import React from 'react'
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'

@withRouter
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.selected,
    }
  }
  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render () {
    const Item = Menu.Item;
    return (
      <div>
        <Menu theme="dark" onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" style={{lineHeight: "60px"}}>
          <Item key="logo" style={{height: 60, width: 150}} disabled>
            <img src={require(`../logo/job.png`)} alt="" height={50}/>
          </Item>
          <Item key="manage" style={{height: 60}}>
            <Link to="/manage">
              <Icon type="edit" />
              问题管理
            </Link>
          </Item>
          <Item key="info" style={{height: 60}}> 
            <Link to="/info">
              <Icon type="snippets" />
              信息
            </Link>
          </Item>
          <div style={{float:"right", marginRight:50}}>
            <a href="http://localhost:3000/login" style={{color: "#FFF"}}><Icon type="logout" style={{paddingRight: 5}}/>登出</a>
          </div>
        </Menu>
      </div>
    )
  }
}

export default Admin;