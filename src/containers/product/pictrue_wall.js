import {Upload, Icon, Modal, message} from 'antd';
import React, {Component} from 'react';
import {BASE_URL} from '../../config/index'
import {reqDeleteImage} from "../../api";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  handleCancel = () => this.setState({previewVisible: false});
  getimagesName = () =>{
    let result = []
    this.state.fileList.forEach(item=>{
      result.push(item.name)
    })
    return result
  }
  setfileList = (imgs) => {
    let fileList = []
    imgs.forEach((item,index)=>{
      fileList.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({
      fileList
    })
}
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async({file, fileList}) => {
    const {status} = file
    if (status === 'done') {
      console.log(file.response.data.url)
      fileList[fileList.length - 1].url = file.response.data.url
      fileList[fileList.length - 1].name = file.response.data.name
    }
    if (status === 'removed') {
      const result = await reqDeleteImage(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      }else{
        message.error(result.msg)
      }
    }
    this.setState({fileList})
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          method="post"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}

export default PicturesWall