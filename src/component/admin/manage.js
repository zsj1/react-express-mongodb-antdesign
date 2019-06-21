import React from "react";
import { connect } from "react-redux";
import { Menu, Layout, Table, Divider, Tag, Button, Modal } from "antd";
import Admin from "./admin";
import { getQueList, reviewQue } from '../../redux/question.redux'
import { getTime } from '../../util'

@connect(
  state => state,
  { getQueList, reviewQue}
)
class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "undo",
      visible: false,
      act: "",
      modalContent: "",
      questionid: "",
      filteredInfo: null,
      sortedInfo: null,
    }
  }
  componentDidMount() {
    if (!this.props.question.questions.length) {
      this.props.getQueList();
    }
  }
  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    // console.log(this.state);
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearSorts = () => {
    this.setState({
      sortedInfo: null,
    });
  };

  showModal = (questionid, act) => {
    this.setState({
      visible: true,
      act: act,
      modalContent: `你确定要${act}该问题吗？`,
      questionid: questionid
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  okModal = () => {
    this.props.reviewQue({questionid:this.state.questionid, act:this.state.act});
    this.props.getQueList();
    this.setState({
      visible: false,
    });
  };

  render() {
    const tagList = ['待审核', '已通过', '已拒绝'];
    const tagColorList = ['geekblue', 'green', 'volcano'];
    const Item = Menu.Item;
    const { Sider, Content } = Layout;
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        // render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: '问题',
        dataIndex: 'question',
        key: 'question',
      },
      {
        title: '补充说明',
        dataIndex: 'addition',
        key: 'addition',
      },
      {
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        render: image => (
            image.length !== 0 ? <img src={require(`../../../image/${image}`)} alt="" width="100px"/> : "空"
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: create_time => (
          getTime(create_time, true)
        ),
        sorter: (a, b) => a.create_time - b.create_time,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        filters:  this.state.current === 'done' ? [{ text: '已通过', value: 1 }, { text: '已拒绝', value: 2 }] : [{ text: '待审核', value: 0 }],
        filteredValue: filteredInfo.state || null,
        onFilter: (value, record) => record.state === value ?  record.state : null,
        render: state => (
          <span>
            <Tag color={tagColorList[state]} key={state}>
              {tagList[state]}
            </Tag>
          </span>
        ),
      },
      this.state.current === "undo" ? {
        title: '操作',
        key: 'action',
        dataIndex: 'questionid',
        render: (questionid) => (
          <span>
            <Button onClick={() => this.showModal(questionid, '通过')} type="primary">通过</Button>
            <Divider type="vertical" />
            <Button onClick={() => this.showModal(questionid, '拒绝')} type="danger">拒绝</Button>
          </span>
        ),
      } : {},
    ];
    const tableData = []
    this.props.question.questions.map((v, i) => {
      if ( (this.state.current === "undo" && v.state === 0) || (this.state.current === "done" && v.state !== 0) ) {
        tableData.push({
          key: i,
          author: this.props.question.users[v.author].name,
          question: v.question,
          addition: v.addition.length > 0 ? v.addition : '空',
          image: v.image.length > 0 ? `${v.author}/${v.image}` : '',
          state: v.state,
          create_time: v.create_time,
          questionid: v._id
        })
      }
      return null;
    })
    // console.log(tableData);
    return (
      <div>
        <Admin selected="manage" />
        <Modal
          title="操作"
          visible={this.state.visible}
          onOk={this.okModal}
          onCancel={this.hideModal}
          width={300}
          okText="确认"
          cancelText="取消"
        >{this.state.modalContent}
        </Modal>
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
                  <Item key="undo">未审核</Item>
                  <Item key="done">已审核</Item>
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
                  <div className="table-operations">
                    <Button onClick={this.clearFilters}>重置过滤</Button>
                    <Button onClick={this.clearSorts}>重置排序</Button>
                  </div>
                  <Table columns={columns} dataSource={tableData} onChange={this.handleChange}/>
                </Content>
              </Layout>
            </Layout>
          </div>
        </Layout>
      </div>
    );
  }
}

export default Manage;
