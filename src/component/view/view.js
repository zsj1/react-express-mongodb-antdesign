import React from "react";
import { connect } from "react-redux";
import { NavBar, Icon, Card, WhiteSpace, Button, PullToRefresh, Popover } from 'antd-mobile'
import { getQueList, getReplyList, delRepl, readQue } from '../../redux/question.redux'
import { getTime } from '../../util'

@connect(
  state=>state,
  { getQueList, getReplyList, delRepl, readQue }
)
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      sortMethod: {
        "default": "默认排序",
        "replyTime": "按时间排序"
      },
      visible: false,
      sortSelected: "default",
    };
  }
  componentDidMount() {
    if (!this.props.question.questions.length) {
      this.props.getQueList();
      this.props.getReplyList({questionid: this.props.match.params.questionid});
    }
  }
  componentWillUnmount() {
    this.props.delRepl();
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
  render() {
    const Item = Popover.Item;
    const Header = Card.Header;
    const Body = Card.Body;
    const Footer = Card.Footer;
    const questionid = this.props.match.params.questionid;
    const question = this.props.question.questions.filter(v => v._id === questionid);
    const replysnum = this.props.question.replys.length;
    let replys = this.props.question.replys;
    if (this.state.sortSelected === "replyTime"){
      replys.sort((a, b) => {
        return b.reply_time - a.reply_time;
      });
    }
    else {
      replys.sort((a, b) => {
        return a.reply_time - b.reply_time;
      });
    }

    return question.length ? ( 
      <div>
        <NavBar 
          className="fixd-header"
          mode='drak'
          icon={<Icon type="left" />}
          onLeftClick={() => {
            if (question[0].author === this.props.user._id ){
              this.props.readQue({questionid: questionid});
            }
            if (this.props.user.lastPage) {
              // console.log(this.props.user.lastPage);
              this.props.history.push(this.props.user.lastPage);
            }
            else {
              this.props.history.push("/questions");
            }
          }}
        >{question[0].question.length > 15 ? question[0].question.substring(0,15)+'. . .' : question[0].question}</NavBar>
        <div style={{marginTop: 45}}>
          <PullToRefresh
            damping={60}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              setTimeout(() => {
                this.props.getQueList();
                this.props.getReplyList({questionid: this.props.match.params.questionid});
                this.setState({ refreshing: false });
              }, 1000);
            }}
          >
            <Card>
              <Body>
                <div style={{fontSize:18}}>
                  {question[0].question.split('\n').map(d=>(
                    <span key={d}><strong>{d}</strong></span>
                  ))}
                </div>
                <WhiteSpace></WhiteSpace>
                <div style={{fontSize:14}}>
                  {question[0].addition.split('\n').map(d=>(
                    <span key={d}>{d}</span>
                  ))}
                </div>
                {question[0].image.length > 0 ? (
                  <div style={{textAlign:"center"}}> 
                    <WhiteSpace></WhiteSpace>
                    <img src={require(`../../../image/${question[0].author}/${question[0].image}`)} alt="" style={{width:"80%"}} />
                  </div>
                ) : null}
              </Body>
              <Footer
                content={<div style={{marginLeft: '10%', height:"100%", width:"100%", fontSize: 14}}>{replysnum} 条评论</div>} 
                extra={<Button 
                        onClick={() => this.props.history.push({ pathname : `/reply/${question[0]._id}` ,query : { question: question[0].question, replysnum: question[0].replysnum} })}
                        type="ghost" icon="check-circle-o" inline size="small" style={{ marginRight: '10%'}}>写回答</Button>}
              >
              </Footer>
            </Card>
            <WhiteSpace></WhiteSpace>
            <NavBar 
              // leftContent={"11"}
              className="sort-nav"
              mode="light"
              rightContent={
                <Popover
                  overlayClassName="fortest"
                  overlayStyle={{ color: 'currentColor' }}
                  visible={this.state.visible}
                  overlay={[
                    (<Item key="1" value="default">默认排序</Item>),
                    (<Item key="2" value="replyTime">按时间排序</Item>),
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
            <WhiteSpace></WhiteSpace>
            {replys.map(v => {
              return (
                v.content ? (
                  <div key={v._id}>
                    <Card>
                      <Header
                        title={this.props.question.users[v.replier].name}
                        thumb={require(`../img/${this.props.question.users[v.replier].avatar}.png`)}
                        onClick={()=> {
                          if (v.replier !== this.props.user._id) {
                            this.props.history.push({pathname: `/chat/${v.replier}`, query: {questionid: questionid}})
                          }
                        }}
                        extra={<span>{getTime(v.reply_time)}</span>}
                      />
                      <Body>
                        <div style={{fontSize:16}}>
                          {v.content.split('\n').map((d, i)=>(
                            <div key={i}>{d}</div>
                          ))}
                        </div>
                      </Body>
                    </Card>
                    <WhiteSpace></WhiteSpace>
                  </div>
                ) : null
              )}
            )}
          </PullToRefresh>
        </div>
      </div>
    ) : null
  }
}

export default View;
