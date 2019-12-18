import React from 'react';
import ReactDOM from 'react-dom';

class Time extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          time:this.props.startTime
        };
      this.add = this.add.bind(this);
      this.getRef = this.getRef.bind(this);
    }
   
    add(){
        this.setState({
            time:this.state.time+1
        });
    }

    getRef(){
        /* 获取字符串方式设置的ref */
        var btn = this.refs.clickBtn;
        /* 获取回调函数方式设置的ref */
        var h2 = this.h2;
    }

    render() {
      return (
        <div>
            {/* 通过字符串设置 */}
          <button ref="clickBtn" onClick={this.add}>点击按钮+1</button>
          {/* 通过回调函数设置(推荐) */}
          <h2 ref={(prop)=>{this.h2 = prop}}>点击了 {this.state.time}次.</h2>
        </div>
      );
    }
  }
   
  ReactDOM.render(
    <Time startTime="0"/>,
    document.getElementById('example')
  );


  
function HelloMessage(props) {
    return <h1>Hello {props.name}!</h1>;
}
 
const element = <HelloMessage name="Runoob"/>;
 
ReactDOM.render(
    element,
    document.getElementById('example')
);

  