// 为react创建动画进行封装
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(func) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { func(); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function UnitBezier(p1x, p1y, p2x, p2y) {
	this.cx=3.0*p1x;
	this.bx=3.0*(p2x-p1x)-this.cx;
	this.ax=1.0-this.cx-this.bx;
	this.cy=3.0*p1y;
	this.by=3.0*(p2y-p1y)-this.cy;
	this.ay=1.0-this.cy-this.by;
}
UnitBezier.prototype = {
	constructor:UnitBezier,
	epsilon : 1e-2,  // 默认精度
	sampleCurveX:function(t) {//贝赛尔曲线t时刻的坐标点的X坐标
		return ((this.ax*t+this.bx)*t+this.cx)*t;
	},
	sampleCurveY:function(t){
		return ((this.ay*t+this.by)*t+this.cy)*t;
	},
	sampleCurveDerivativeX:function(t) {//贝赛尔曲线t时刻的坐标点的Y坐标
		return (3.0*this.ax*t+2.0*this.bx)*t+this.cx;
	},
	solveCurveX:function(x,epsilon) {
		var t0,
			t1,
			t2,
			x2,
			d2,
			i;
		for (t2=x,i=0;i<8;i++) {
			x2= this.sampleCurveX(t2)-x;
			if(Math.abs (x2)<epsilon)
				return t2;
			d2=this.sampleCurveDerivativeX(t2);
			if(Math.abs(d2)<epsilon)
				break;
			t2=t2-x2/d2;
		}
		t0=0.0;
		t1=1.0;
		t2=x;
		if(t2<t0) return t0;
		if(t2>t1) return t1;
		while (t0<t1) {
			x2=this.sampleCurveX(t2);
			if (Math.abs(x2-x)<epsilon)
				return t2;
			if (x>x2) t0=t2;
			else t1=t2;
			t2=(t1-t0)*.5+t0;
		}
		return t2;
	},
	solve:function(x,epsilon) {
		return this.sampleCurveY(this.solveCurveX(x,epsilon));
	}
}
var defaultPattern={
	ease:new UnitBezier(0.25,0.1,0.25,1),
	linear:new UnitBezier(0,0,1,1),
	easeIn:new UnitBezier(0.42,0,1,1),
	easeOut:new UnitBezier(0,0,0.58,1),
	easeInOut:new UnitBezier(0.42,0,0.58,1)
}
var speedPattern=function(){
	var Bezier=defaultPattern[arguments[0]];
	return function(curTime,startValue,endValue,duration){
		return  Bezier.solve(curTime/duration,UnitBezier.prototype.epsilon)*(endValue-startValue)+startValue;
	}
}

var flexibleAniamtion={
	aniamtion:[],
	init:function(startInf,animationName){ // 设置动画的初始值
		this.aniamtion[animationName]={};
		this.aniamtion[animationName].duration=startInf.duration||1000;
		this.aniamtion[animationName].easing=startInf.easing||'ease';
		this.aniamtion[animationName].endValue=startInf.endValue;
		this.aniamtion[animationName].callback=startInf.callback;
	},
	star:function(that,animationName){
		var startTime=+new Date(),
			 self=this.aniamtion[animationName],
			 duration=self.duration,
			 easing=speedPattern(self.easing),
			 i;
		var go=function(){
				var t=+new Date(),
					result='';
				if(t>=startTime+duration){
					that.setState(self.endValue);
					if(self.callback){
						self.callback();
					}
					return false;
				}
				else{
					var cur={};
					for( i in self.endValue ){
							cur[i]=easing(t-startTime,that.state[i],self.endValue[i],duration);
					}
					that.setState(cur);
					requestAnimationFrame(function(){
						go();
					});
				}
		};
		go();
	}

}
module.exports=flexibleAniamtion;