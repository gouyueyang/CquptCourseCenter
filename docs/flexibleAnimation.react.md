## flexibleAnimation.react

基于react渲染原理，定制的一个动画库，支持基本属性的动画变化，这个版本没有加入对色彩、矩阵的变化。

### 快速开始

首页要import或者require这个文件

```
improt flexAnimation form './flexibleAnimation.react'


```

为组件绑定要变化的样式

```
class Test extends React.Component{
	constructor(props){
		this.state={
			marginTop:0
		}
	}
	render(){
		return(
			<div style={marginTop:this.state.marginTop}>
					我是动画
			</div>
		)
	}
}


```



初始化动画信息和生产动画

```

	flexAnimation.init({
		duration:that.props.time,// 动画的持续时间,ms
		easing:that.props.easing,// 可选，默认为'ease',动画播放速率变化模式:ease、linear、easeIn
		endValue:{
			left:newpos
		},
		callback:function () {
			that.setState({
				animation:false
			}	
		}
	},'myAnimation');
	flexAnimation.star(that,'myAnimation');

```

#### flexAnimation.init([object],animationName) 参数说明

[object]

- duration: 可选,数字,动画持续时间,ms,默认1000ms
- easing: 可选,字符串,动画播放的变化速率,'ease'(默认)、'linear'、'easeIn'、'easeOut'、'easeInOut'
- endValue: 必须,对象,动画最终生成的样式
- callback：动画完成时的回调函数

animationName

- 这个动画的名称


#### flexAnimation.star(componentObject,animationName) 参数说明

- componentObject 某个组件的实例对象
- animationName	动画名称