import React from 'react'
import axios from 'axios'

import { exportToJson } from './utils'
import { ImportDialog } from './Dialogs'
import { ItemInfo } from './datatypes'

type setInfoMth = (info: ItemInfo) => void

const buildFileSelector = (setInfo: setInfoMth) => {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.setAttribute('accept', '.json')
  fileSelector.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement
    let file: File = (target.files as FileList)[0]
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios({
      method: 'post',
      url: '/file/json',
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if(res.data.status !== '0') {
      // 获取失败
      return
    }
    // 上传成功了
    console.log(res.data.data)
    return
    // let reader = new FileReader()
    // reader.onload = () => {
    //   setInfo(JSON.parse(reader.result as string))
    // }
    // if (file !== undefined) {
    //   reader.readAsText(file)
    // }
  })
  return fileSelector;
}

type UploadBtnProps = {
  setInfo: setInfoMth,
}

type UploadBtnState = {
  fileSelector: HTMLInputElement,
}

class UploadBtn extends React.Component<UploadBtnProps, UploadBtnState> {
  componentDidMount(){
    this.setState({
      fileSelector: buildFileSelector(this.props.setInfo)
    })
  }
  
  handleFileSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    this.state.fileSelector.click();
  }
  
  render(){
    return <button onClick={this.handleFileSelect}>Upload File (JSON)</button>
    // return <button onClick={this.handleFileSelect}> TODO </button>
  }
}

const buildFileSelector1 = (setInfo: setInfoMth) => {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  fileSelector.setAttribute('accept', '.json')
  fileSelector.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement
    let file: File = (target.files as FileList)[0]
    let reader = new FileReader()
    reader.onload = () => {
      setInfo(JSON.parse(reader.result as string))
    }
    if (file !== undefined) {
      reader.readAsText(file)
    }
  })
  return fileSelector;
}

type UploadBtnProps1 = {
  setInfo: setInfoMth
}

type UploadBtnState1 = {
  fileSelector: HTMLInputElement,
}

class UploadBtn1 extends React.Component<UploadBtnProps1, UploadBtnState1> {
  componentDidMount(){
    this.setState({
      fileSelector: buildFileSelector1(this.props.setInfo)
    })
  }
  
  handleFileSelect1 = (e: React.MouseEvent) => {
    e.preventDefault();
    this.state.fileSelector.click();
  }
  
  render(){
    return <button onClick={this.handleFileSelect1}>打开文件</button>
  }
}





type ToolBarProps = {
  info: ItemInfo,
  setInfo: setInfoMth,
}


export default class ToolBar extends React.Component<ToolBarProps, object> {
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const res = await axios.get('/file/data');
    if(res.data.status !== '0') {
      // 获取失败
      return
    }
    console.log(res.data.data)
  }
  
  render() {
    return (
      <div className="toolbar">
        <div className="rightside">
          <ImportDialog info={this.props.info} setInfo={this.props.setInfo}/>
          <UploadBtn setInfo={this.props.setInfo}/>
          <button onClick={() => {exportToJson(this.props.info, "export.json")}}>Download File (JSON)</button>
          {/* <button onClick={() => {exportToJson(this.props.info, "export.json")}}> TODO </button> */}
          {/* <UploadBtn1 setInfo={() => {}} /> */}
          <UploadBtn1 setInfo={this.props.setInfo}/>
        </div>
      </div>
    )
  }
}
