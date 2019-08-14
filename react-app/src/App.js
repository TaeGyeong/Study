import React, {Component} from 'react'
// import logo from './logo.svg'
import './App.css'
import TOC from './TOC'
import Subject from './Subject'
import ReadContent from './ReadContent'
import Control from './Control'
import CreateContent from './CreateContent'
import UpdateContent from './UpdateContent'

class App extends Component {
  constructor(props) {
    super(props)
    this.max_content_id = 3
    this.state = {
      mode:'welcome',
      selected_content_id:2,
      subject:{title:'WEB', sub:'World Wide Web'},
      welcome:{title:'Welcome', desc:'Hello, React >_<'},
      contents:[
        {id:1, title:'HTML', desc:'HTML is for information'},
        {id:2, title:'CSS', desc:'CSS is design'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interactive'}
      ]
    }
  } 

  getReadContent = () => {
    let i = 0
    while(i < this.state.contents.length){
      let data = this.state.contents[i]
      if(data.id === this.state.selected_content_id) {
        return data
      }
      i = i + 1
    }
  }
  
  getContent = () => {
    console.log('App Render')
    let _title, _desc, _article, _content = null
    if (this.state.mode === 'welcome') {
      _title = this.state.welcome.title
      _desc = this.state.welcome.desc
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>
    }
    else if (this.state.mode === 'read') {
      _content = this.getReadContent()
      _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>
    } else if (this.state.mode === 'create') {
      _article = <CreateContent onSubmit={function(_title, _desc){
        //add content to this.state.contents
        this.max_content_id = this.max_content_id + 1
        // this.state.contents.push(
        //   {id:this.max_content_id, title:_title, desc:_desc}
        // )
        this.setState({
          contents: this.state.contents.concat(
            {id:this.max_content_id, title:_title, desc:_desc}  
          ),
          mode: 'read', selected_content_id: this.max_content_id
        })
      }.bind(this)}></CreateContent>
    } else if (this.state.mode === 'update') {
      _content = this.getReadContent()
      _article = <UpdateContent 
        data={_content} 
        onSubmit={function(_id, _title, _desc){
          let _contents = Array.from(this.state.contents)
          let i=0
          while (i < _contents.length) {
            if(_contents[i].id === _id) {
              _contents[i] = {id: _id, title: _title, desc:_desc}
              break
            }
            i = i+1
          }
          this.setState({
            contents: _contents, 
            mode: 'read'
          })
        }.bind(this)}
      ></UpdateContent>
    }
    return _article
  }

  // component 실행시 constructor를 먼저 실행해서 초기화
  // constructor 를 짜서 안에다가 코드를 작성한다.
  render() {
    return(
      <div className="App">
        <Subject 
          title={this.state.subject.title} 
          sub={this.state.subject.sub}
          onChangePage={() => {
            this.setState({mode:'welcome'})
          }}
        ></Subject>
        <TOC 
          onChangePage={(id) => {
            this.setState({mode:'read', selected_content_id:Number(id)})            
          }} 
          data={this.state.contents}
        ></TOC>
        <Control
          onChangeMode={function(_mode){
            if(_mode === 'delete') {
              if(window.confirm('really?')) {// 사용자가 확인누르면 True, 아니면 False.
                let i=0, _contents=Array.from(this.state.contents)
                while(i<this.state.contents.length) {
                  if(_contents[i].id === this.state.selected_content_id){
                    _contents.splice(i, 1) // i번째 원소부터 1개를 지운다.
                    break
                  }
                  i = i + 1
                }
                this.setState({
                  mode:'welcome',
                  contents: _contents
                })
                alert('deleted')             
              }
            } else {
              this.setState({
                mode : _mode
              })
            }
          }.bind(this)}
        ></Control>
        {this.getContent()}
      </div>
    )
  }
}

export default App;
