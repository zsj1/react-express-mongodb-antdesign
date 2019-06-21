import React from "react";
import PropTypes from "prop-types";
import { TabBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
@withRouter
@connect(state => state)
class NavLinkBar extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };
  render() {
    const navList = this.props.data.filter(v => !v.hide);
    const { pathname } = this.props.location;
    return (
      <div style={{ position: "fixed"}}>
        <TabBar
          noRenderContent={true}
        >
          {navList.map(v => (
            <TabBar.Item
              badge={v.path === "/msg" ? this.props.chat.unread : v.path === "/me" && this.props.question.myquestions.filter(v => v.isnew === true).length > 0 ? 'new' : 0 }
              key={v.path}
              title={v.text}
              icon={{ uri: require(`./img/${v.icon}.png`) }}
              selectedIcon={{ uri: require(`./img/${v.icon}-active.png`) }}
              selected={pathname === v.path}
              onPress={() => {
                this.props.history.push(v.path);
              }}
            />
          ))}
        </TabBar>
      </div>
    );
  }
}

export default NavLinkBar;
