import React from "react";
import { Card, WhiteSpace, WingBlank } from "antd-mobile";
import PropTypes from "prop-types";
import {withRouter} from 'react-router-dom'

@withRouter
class UserCard extends React.Component {
  static propTypes = {
    userlist: PropTypes.array.isRequired
  };
  handleClick(v) {
    this.props.history.push(`/chat/${v._id}`);
  }

  render() {
    const Header = Card.Header;
    const Body = Card.Body;
    const Footer = Card.Footer;
    return (
      <WingBlank>
        <WhiteSpace />
        {this.props.userlist.map(v =>
          v.avatar ? (
            <Card 
              key={v._id} 
              onClick={()=>this.handleClick(v)}
            >
              <Header
                title={v.user}
                thumb={require(`../img/${v.avatar}.png`)}
                extra={<span>{v.title}</span>}
              />
              <Body>
                {/* {v.type=='boss'? <div>公司:{v.company}</div> :null} */}
                {v.desc.split('\n').map(d=>(
                  <div key={d}>{d}</div>
                ))}
                {/* {v.type=='boss'? <div>薪资:{v.money}</div> :null} */}
              </Body>
              {v.type === "boss" ?
              <Footer content={`公司:${v.company}`} extra={<div>薪资:{v.money}</div>} />
              :null}
            </Card>
          ) : null
        )}
      </WingBlank>
    );
  }
}

export default UserCard;