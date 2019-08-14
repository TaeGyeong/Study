import React, {Component} from 'react'
class Control extends Component { 
    crudFunction = (k, e) => {
        e.preventDefault()
        this.props.onChangeMode(k)
    }
    render() {
        return(
            <ul>
                <li><a href='/create' 
                    onClick={this.crudFunction.bind(this, 'create')}
                >create</a>
                </li>
                <li><a href='/update'
                    onClick={this.crudFunction.bind(this, 'update')}
                >update</a></li>
                <li><input type='button' 
                onClick={this.crudFunction.bind(this, 'delete')} 
                value='delete'></input></li>
            </ul>
        )
    }
}
export default Control