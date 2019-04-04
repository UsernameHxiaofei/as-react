import React,{Component} from 'react'
class Printing extends Component {
    render(){
        return(
            <div style={{ width: '100%',height:'500px',overflowY:'auto'}}>
           <iframe
           scrolling='auto'
           src={this.props.src}
           frameBorder={0}
            seamless='seamless'
           width='100%'
           height='100%'
           />
           </div>
        )
    }
}
export default Printing