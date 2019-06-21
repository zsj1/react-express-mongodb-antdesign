import React from "react";
import {
  NavBar,
  Icon,
  List,
  TextareaItem,
  WhiteSpace,
  Button,
  ImagePicker,
  Toast
} from "antd-mobile";
import { connect } from "react-redux";
import { postQue } from '../../redux/question.redux'
@connect(
  state => state,
  {postQue}
)
class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      question: "",
      addition: "",
    };
  }

  onChange(key,val){
		this.setState({
			[key]:val
    })
	}
  onImageChange = (files, type, index) => {
    this.setState({
      files
    });
    // [...this.state.files].forEach(v => console.log(v.url));
  };
  onSubmit() {
    if (!this.state.question.length) {
      Toast.fail('请输入一个问题', 1);
    } else {
      const regex = /^data:.+\/(.+);base64,(.*)$/;
      let imgInfo = [];
      this.state.files.forEach((v, i) => {
        const matches = v.url.match(regex);
        // // const imgExt = matches[1];
        const imgData = matches[2];
        const imgName = i + "_" + new Date().getTime() + "_" + v.file.name;
        imgInfo.push({
          // imgExt,
          imgData: imgData,
          imgName: imgName,
        });
      });
      this.props.postQue({
        image: imgInfo,
        question: this.state.question,
        addition: this.state.addition
      })
      Toast.success('提交成功', 1);
      this.props.history.push("/questions");
    } 
  }
  render() {
    const Item = List.Item;
    const Brief = List.Item.Brief;
    return (
      <div>
        <NavBar
          className="fixd-header"
          mode="drak"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          发布问题
        </NavBar>
        <WhiteSpace />
        <List renderHeader={() => "Auto / Fixed height"}>
          <Item>
            <TextareaItem
              rows={3}
              placeholder="请输入问题。"
              onChange={(v)=>this.onChange('question',v)}
              autoHeight
              count={100}
            />
          </Item>
          <Item>
            <TextareaItem
              autoHeight
              rows={10}
              onChange={(v)=>this.onChange('addition',v)}
              placeholder="对问题补充说明，选填。"
            />
          </Item>
          <Item>
            <Brief>可选择一张图片进行上传，帮助描述问题信息。</Brief>
            <ImagePicker
              files={this.state.files}
              onChange={this.onImageChange}
              // onImageClick={(index, fs) => console.log(index, fs)}
              selectable={this.state.files.length < 1}
              multiple={true}
            />
          </Item>
          <Item>
            <Button type="ghost" onClick={() => this.onSubmit()}>
              发布问题
            </Button>
          </Item>
        </List>
      </div>
    );
  }
}

export default Post;
