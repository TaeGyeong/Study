import React, {Component} from 'react'
class TOC extends Component {
  shouldComponentUpdate(newProps, newState) {
    console.log(newProps.data, this.props.data)
    if(this.props.data === newProps.data){
      return false // render 실행X
    }
    return true // render 실행
  }
  handleClick = (id, e) => {
    e.preventDefault()
    this.props.onChangePage(e.target.dataset.id, id)
  }
  render() {
    const data = this.props.data
    let lists = []
    let i = 0
    while (i < data.length) {
      lists.push(
        <li key={data[i].id}>
          <a 
            onClick={this.handleClick.bind(this, data[i].id)}
            href={'/content/'+data[i].id}
            data-id = {data[i].id}
          >
              {data[i].title}
          </a>
          </li>
        )        
        i = i + 1
    }

    return(  
      <nav>
        <ul>
          {lists}
        </ul>
      </nav>
    )
  }
}
export default TOC;