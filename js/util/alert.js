import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import './alert.css';
 
 
let defaultState = {
  alertStatus:false,
  alertTip:"提示",
  closeAlert:function(){}
}
 
class Alert extends Component{
 
  state = {
    ...defaultState
  };
  // css动画组件设置为目标组件
  FirstChild = props => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
  }
  // 关闭弹框
  confirm = () => {
    this.state.closeAlert();
    this.setState({
      alertStatus:false
    })
  }
  open =(options)=>{
    options = options || {};
    options.alertStatus = true;
    this.setState({
      ...defaultState,
      ...options
    })
  }
  close(){
    this.state.closeAlert();
    this.setState({
      ...defaultState
    })
  }
  shouldComponentUpdate(nextProps, nextState){
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
   
  render(){
    return (
      <ReactCSSTransitionGroup
        component={this.FirstChild}
        transitionName='hide'
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <div className="alert-con" style={this.state.alertStatus? {display:'block'}:{display:'none'}}>
          <div className="alert-context">
            <div className="alert-content-detail">{this.state.alertTip}</div>
            <div className="comfirm" onClick={this.confirm}>确认</div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
 
let div = window.top.document.createElement('div');
let props = {
   
};
window.top.document.body.appendChild(div);
 
let Box = ReactDOM.render(React.createElement(
  Alert,
  props
),div);
 
 
 
export default Box;