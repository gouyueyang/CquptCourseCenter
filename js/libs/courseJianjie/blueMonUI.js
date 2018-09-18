import React from 'react';
import ReactDOM from 'react-dom';
var ajax=require('./post_ajax.js');


class BluMUI_CreateJianjie extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let JS;
    if(this.props.Jianjie=='') {
      JS=<p style={{textAlign: 'center'}}>没有数据！</p>;
    } else {
      JS=this.props.Jianjie;
    }
    return(<div>{JS}</div>);
  }
}


var BluMUI_M = {
  Create_jianjie:BluMUI_CreateJianjie,
}

var BluMUI = {
	result: {},
	create: function (data, type, elem) {
		var props = data, Blu = BluMUI_M[type];
		this.result[props.id] = ReactDOM.render(<Blu {...props}/>, elem);    
	}
};

export default BluMUI;
