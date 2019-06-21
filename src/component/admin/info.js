import React from "react";
import { connect } from "react-redux";
import { getQueList } from '../../redux/question.redux'
import Admin from './admin';
import echarts from 'echarts/lib/echarts';
import { series } from 'echarts/lib/chart/pie'
import { title } from 'echarts/lib/component/title'
import { tooltip } from 'echarts/lib/component/tooltip'
import { lengend } from 'echarts/lib/component/legend'
import { toolbox } from 'echarts/lib/component/toolbox'
import { getPieChartOption } from '../../util'
import { Statistic, Row, Col, Menu, Layout, Card } from 'antd';

@connect(
  state => state,
  { getQueList}
)
class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "user",
    }
  }
  componentDidMount() {
    if (!this.props.question.questions.length) {
      this.props.getQueList();
    }
    else {
      this.getOption(this.state.current);
    }
  }
  getOption(type) {
    let titleList = [];
    let dataList = [];
    let name = "";
    if ( type === "user") {
      name = "用户分布图"
      titleList = ['BOSS', '牛人'];
      dataList = [
        {name: 'BOSS', value: Object.values(this.props.question.users).filter(v => v.type === "boss").length},
        {name: '牛人', value: Object.values(this.props.question.users).filter(v => v.type === "genius").length}
      ]
    } else {
      name = "问题分布图"
      titleList = ['待审核问题', '已通过问题', '已拒绝问题'];
      dataList = [
        {name: '待审核问题', value: this.props.question.questions.filter(v => v.state === 0).length},
        {name: '已通过问题', value: this.props.question.questions.filter(v => v.state === 1).length},
        {name: '已拒绝问题', value: this.props.question.questions.filter(v => v.state === 2).length},
      ]
    }
    // console.log(getPieChartOption(name, titleList, dataList));
    echarts.init(document.getElementById('pie')).setOption(getPieChartOption(name, titleList, dataList));
  }
  handleClick = e => {
    this.setState({
      current: e.key,
    });
    this.getOption(e.key);
  };
  render() {
    const Item = Menu.Item;
    const { Sider, Content } = Layout;
    return (
      <div>
        <Admin selected="info"></Admin>
        <Layout>
          <div>
            <Layout>
              <Sider width={150} style={{ background: "#fff" }}>
                <Menu
                  mode="inline"
                  theme="light"
                  style={{ width: 150, height: "100%", borderRight: 0 }}
                  onClick={this.handleClick} 
                  selectedKeys={[this.state.current]}
                >
                  <Item key="user">用户分布</Item>
                  <Item key="question">问题分布</Item>
                </Menu>
              </Sider>
              <Layout style={{ padding: "24px 24px 24px" }}>
                <Content
                  style={{
                    background: "#fff",
                    padding: 24,
                    margin: 0,
                    minHeight: 708,
                  }}
                >
                  <div style={{ background: '#ECECEC', padding: '30px' }}>
                    {this.state.current === "user" ? (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card>
                            <Statistic title="BOSS用户数量" value={Object.values(this.props.question.users).filter(v => v.type === "boss").length} valueStyle={{ color: 'blue' }}/>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>
                            <Statistic title="牛人用户数量" value={Object.values(this.props.question.users).filter(v => v.type === "genius").length} valueStyle={{ color: 'blue' }}/>
                          </Card>
                        </Col>
                      </Row>
                      ) : (
                        <Row gutter={16}>
                          <Col span={8}>
                            <Card>
                              <Statistic title="待审核问题数量" value={this.props.question.questions.filter(v => v.state === 0).length} valueStyle={{ color: 'blue' }}/>
                            </Card>
                          </Col>
                          <Col span={8}>
                            <Card>
                              <Statistic title="已通过问题数量" value={this.props.question.questions.filter(v => v.state === 1).length} valueStyle={{ color: 'green' }}/>
                            </Card>
                          </Col>
                          <Col span={8}>
                            <Card>
                              <Statistic title="已拒绝问题数量" value={this.props.question.questions.filter(v => v.state === 2).length} valueStyle={{ color: 'red' }}/>
                            </Card>
                          </Col>
                      </Row>
                      )
                    }
                  </div>
                  <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Card>
                      <div id="pie" style={{height: 600}}></div>
                    </Card>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </div>
        </Layout>
      </div>
    );
  }
}

export default Info;
