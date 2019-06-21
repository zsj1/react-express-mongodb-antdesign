import React from 'react'
import {NavBar, Icon, SegmentedControl, WhiteSpace, Card, Flex, Badge} from 'antd-mobile'
import {connect} from 'react-redux'
import {getMyQueList, getQueList, getReplyList} from '../../redux/question.redux'
import { record } from '../../redux/user.redux'
import { getTime } from '../../util'

@connect(
  state => state,
  {getMyQueList, getQueList, record, getReplyList}
)
class MyQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 1
    }
  }
  componentDidMount() {
    if (!this.props.question.questions.length) {
      this.props.getQueList();
    }
    if (!this.props.question.myquestions.length) {
      this.props.getMyQueList();
    }
  }
  onChange = (e) => {
    this.setState({
      status: e.nativeEvent.selectedSegmentIndex
    })
    // console.log(`selectedIndex:${e.nativeEvent.selectedSegmentIndex}`);
  }
  handleClick(v) {
    // alert(v._id);
    this.props.getReplyList({questionid: v._id});
    this.props.record("/myquestion");
    this.props.history.push(`/question/${v._id}`);
  }

  render () {
    const questions = this.props.question.myquestions.filter(v => v.state === this.state.status).sort((a, b) => {
      return a.isnew === b.isnew ? b.update_time - a.update_time : b.isnew - a.isnew;
    });
    const Header = Card.Header;
    const Body = Card.Body;
    const Footer = Card.Footer;
    return (
      <div>
          <NavBar
            className="fixd-header"
            mode="drak"
            icon={<Icon type="left" />}
            onLeftClick={() => {
              this.props.history.push('/me');
            }}
          >
            我的问题
          </NavBar>
          <WhiteSpace></WhiteSpace>
          <div style={{marginTop: 45}}>
            <SegmentedControl
              selectedIndex={this.state.status}
              values={['待审核', '已发布', '被驳回']}
              style={{ height: '40px' }}
              // tintColor={'#ff0000'}
              onChange={this.onChange}
              // onValueChange={this.onValueChange}
            />
            {questions.map(v => {
              return (
                v.question ? (
                  <div key={v._id}>
                    <Card>
                      {v.state === 1 ? (
                        <Header 
                          title={<div style={{fontSize: 14, color: "grey"}}>最后回复时间 {getTime(v.update_time)}</div>}
                          extra={v.isnew === true ? <Badge text={'new'} style={{ marginLeft: 12 }} /> : null}
                      />) : null
                      }
                      <Body
                        onClick={()=> {
                            if (v.state === 1) {
                              this.handleClick(v)
                            }
                          }
                        }
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
                        extra={<div><span>发布时间 {getTime(v.create_time, true)}</span></div>}
                      />
                    </Card>
                    <WhiteSpace></WhiteSpace>
                  </div>
                ) : null
              )}
            )}
          </div>
      </div>
    )
  }
}

export default MyQuestion