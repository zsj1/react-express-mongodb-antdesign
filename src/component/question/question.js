import React from "react";
import { SearchBar, Button, WhiteSpace, Card, Flex, PullToRefresh, Popover, Icon, NavBar } from "antd-mobile";
import {connect} from 'react-redux'
import { getQueList, getReplyList } from '../../redux/question.redux'
import { record } from '../../redux/user.redux'
import { getTime } from '../../util'
@connect(
  state => state,
  {getQueList, getReplyList, record}
)
class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      text: "",
      sortMethod: {
        "default": "默认排序",
        "createTime": "按发布时间排序",
        "updateTime": "按更新时间排序",
        "replysnum": "按回复数量排序",
      },
      visible: false,
      sortSelected: "default",
    };
  }
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };
  onSelect = (opt) => {
    this.setState({
      visible: false,
      sortSelected: opt.props.value,
    });
  };
  onSubmit = value => {
    this.setState({
      text: value
    });
  };
  onChange = value => {
    if ( value === "") {
      this.setState({
        text: ""
      });
    }
  };
  handleClick(v) {
    // alert(v._id);
    this.props.getReplyList({questionid: v._id});
    this.props.record("/questions");
    this.props.history.push(`/question/${v._id}`);
  }
  render() {
    const Item = Popover.Item;
    const Header = Card.Header;
    const Body = Card.Body;
    const Footer = Card.Footer;
    let questions = this.props.question.questions.filter(v => v.state === 1);
    if (this.state.sortSelected === "default"){
      questions.sort((a, b) => {
        return a.create_time - b.create_time;
      });
    }
    else if (this.state.sortSelected === "createTime") {
      questions.sort((a, b) => {
        return b.create_time - a.create_time;
      });
    }
    else if (this.state.sortSelected === "updateTime") {
      questions.sort((a, b) => {
        return b.update_time - a.update_time;
      });
    }
    else if (this.state.sortSelected === "replysnum") {
      questions.sort((a, b) => {
        return b.replysnum - a.replysnum;
      });
    }
    if (this.state.text.length > 0) {
      questions = questions.filter(v => {
        return (v.question.indexOf(this.state.text) !== -1);
      });
    }
    // const Footer = Card.Footer;
    return (
      <div>
        <div className="search-header">
          {/* <div style={{zIndex:9998, position: "fixed", width:"100%",top: 0, borderColor:"#FFF"}}> */}
          <Flex>
            <Flex.Item style={{ flex: 4 }}>
              <SearchBar
                placeholder="Search"
                // onCancel={this.onCancel}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
              />
            </Flex.Item>
            <WhiteSpace />
            <Flex.Item style={{ flex: 1 }}>
              <Button
                type="primary"
                size="small"
                style={{ height: "100%" }}
                onClick={() => this.props.history.push("/post")}
              >
                提问
              </Button>
            </Flex.Item>
          </Flex>
          <NavBar 
              className="sort-nav"
              mode="light"
              rightContent={
                <Popover
                  overlayClassName="fortest"
                  overlayStyle={{ color: 'currentColor' }}
                  visible={this.state.visible}
                  overlay={[
                    (<Item key="1" value="default">默认排序</Item>),
                    (<Item key="2" value="createTime">按发布时间排序</Item>),
                    (<Item key="3" value="updateTime">按更新时间排序</Item>),
                    (<Item key="4" value="replysnum">按回复数量排序</Item>),
                  ]}
                  align={{
                    overflow: { adjustY: 0, adjustX: 0 },
                    offset: [-10, 0],
                  }}
                  onVisibleChange={this.handleVisibleChange}
                  onSelect={this.onSelect}
                >
                  <div style={{
                    height: '100%',
                    padding: '0 15px',
                    marginRight: '-15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  >
                    {this.state.sortMethod[this.state.sortSelected]}<Icon type="down" />
                  </div>
                </Popover>
              }
            >
          </NavBar>
        </div>
        <WhiteSpace></WhiteSpace>
        <div>
          <PullToRefresh
            damping={60}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              setTimeout(() => {
                this.props.getQueList();
                this.setState({ refreshing: false });
              }, 1000);
            }}
          >
            {questions.map(v => {
              return (
                v.question ? (
                  <div key={v._id}>
                    <Card>
                      <Header
                        onClick={() => {
                          if (this.props.user._id !== v.author) {
                            this.props.history.push(`/chat/${v.author}`);
                          }
                        }}
                        title={this.props.question.users[v.author].name}
                        thumb={require(`../img/${this.props.question.users[v.author].avatar}.png`)}
                      />
                      <Body
                        onClick={()=>this.handleClick(v)}
                      >
                        {v.image.length > 0 ? (
                          <Flex>
                            <Flex.Item style={{ flex: 3 }}>
                              {v.question.split('\n').map(d=>(
                                <div key={d}><strong>{d}</strong></div>
                              ))}
                            </Flex.Item>
                            <Flex.Item>
                              <img src={require(`../../../image/${v.author}/${v.image}`)} alt="" style={{width:"100%"}} />
                            </Flex.Item>
                          </Flex>) 
                          : 
                          v.question.split('\n').map(d=>(
                            <div key={d}><strong>{d}</strong></div>
                          ))
                        }
                      </Body>
                      <Footer
                        content={<div style={{fontSize: 14}}>回复数 {v.replysnum}</div>}
                        extra={<div>{getTime(v.create_time)}</div>}
                      />
                    </Card>
                    <WhiteSpace></WhiteSpace>
                  </div>
                ) : null
              )}
            )}
          </PullToRefresh>
        </div>
      </div>
    );
  }
}

export default Question;
