import React from "react";
import { Grid, List } from "antd-mobile";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

@connect(
	state=>state.user,
)
class AvatarSelector extends React.Component {
  static propTypes = {
    selectAvatar: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const avatarList = "boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra"
      .split(",")
      .map(v => ({
        icon: require(`../img/${v}.png`),
        text: v
      }));
    const gridHeader = this.state.text ? (
      <div>
        <span>已选择头像</span>
        <img style={{ width: 20 }} src={this.state.icon} alt="" />
      </div>
    ) : this.props.avatar ? (
      <div>
        <span>已选择头像</span>
        <img style={{ width: 20 }} src={require(`../img/${this.props.avatar}.png`)} alt="" />
      </div>
    ) : (
      <div>请选择头像</div>
    );
    return (
      <div>
        <List renderHeader={()=>gridHeader}>
          <Grid
            data={avatarList}
            columnNum={5}
            onClick={elm => {
              this.setState(elm);
              this.props.selectAvatar(elm.text);
            }}
          />
        </List>
      </div>
    );
  }
}

export default AvatarSelector
