webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(158);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ajax = __webpack_require__(159);
	var Place = 2;
	var url_place = parseHash(window.location.href);
	if ("place" in url_place) {
	  Place = url_place.place;
	}
	var User = {
	  id: ''
	};
	var Course = {
	  kcbh: ''
	};
	User.id = getCookie('userId');
	Course.kcbh = parseHash(window.location.href).classId;

	var JianJie = function (_React$Component) {
	  _inherits(JianJie, _React$Component);

	  function JianJie() {
	    _classCallCheck(this, JianJie);

	    return _possibleConstructorReturn(this, (JianJie.__proto__ || Object.getPrototypeOf(JianJie)).apply(this, arguments));
	  }

	  _createClass(JianJie, [{
	    key: 'render',
	    value: function render() {
	      var H5 = '';
	      if (this.props.H5) {
	        H5 = _react2["default"].createElement('div', { id: 'intro', dangerouslySetInnerHTML: { __html: this.props.H5 } });
	      } else {
	        H5 = _react2["default"].createElement(
	          'div',
	          { id: 'intro' },
	          this.props.intro
	        );
	      }
	      return H5;
	    }
	  }]);

	  return JianJie;
	}(_react2["default"].Component);

	/*

	      <div id="title">{this.props.courseName}课程简介</div>
	      <div id="infos">
	        <div id="left">
	          <p>
	            <span id="No">课程编号：{this.props.infos.No}</span>
	            <span>学时[学分]：{this.props.infos.xs}[{this.props.infos.xf}]</span>
	          </p>
	          <p>适用专业：{this.props.infos.suit}</p>
	        </div>
	        <div id="right">
	          <p>课程类型：{this.props.infos.type}</p>
	        </div>
	      </div>
	      { H5 }
	*/
	// getCourseHomePageMsg

	function aj1() {
	  return new Promise(function (resolve, reject) {
	    ajax({
	      url: courseCenter.host + 'getCourseIntroducePageMsg',
	      data: {
	        kcbh: Course.kcbh,
	        unifyCode: User.id,
	        place: Place
	      },
	      success: function success(gets) {
	        var datas = JSON.parse(gets).data[0];
	        var D = JSON.parse(gets);
	        if (D.meta.result == 101) {
	          window.location.href = 'error1.html';
	          return;
	        } else if (D.meta.result == 102) {
	          window.location.href = 'error2.html';
	          return;
	        }
	        var intro = datas.kcjs;
	        var courseName = datas.kcmc;
	        var H5 = datas.kcjshtml;
	        resolve({ intro: intro, courseName: courseName, H5: H5 });
	      }
	    });
	  });
	}

	function aj2() {
	  return new Promise(function (resolve, reject) {
	    ajax({
	      url: courseCenter.host + 'getCourseHomePageMsg',
	      data: {
	        kcbh: Course.kcbh,
	        unifyCode: User.id
	      },
	      success: function success(gets) {
	        var datas = JSON.parse(gets).data;
	        var D = JSON.parse(gets);
	        if (D.meta.result == 101) {
	          window.location.href = 'error1.html';
	          return;
	        } else if (D.meta.result == 102) {
	          window.location.href = 'error2.html';
	          return;
	        }
	        var No = datas.courseBaseMsg[0].kcbh;
	        var type = datas.courseBaseMsg[0].kclx;
	        type = ['其他', '选修课程', '必修课程'][type];
	        var xf = parseInt(datas.courseIntrodeceList[0].xf);
	        var xs = parseInt(datas.courseIntrodeceList[0].xs);
	        var suit = datas.courseIntrodeceList[0].applyMajor.join(',');
	        resolve({ infos: { No: No, type: type, xf: xf, xs: xs, suit: suit } });
	      }
	    });
	  });
	}

	Promise.all([aj1(), aj2()]).then(function (results) {
	  var introData = Object.assign(results[0], results[1]);
	  _reactDom2["default"].render(_react2["default"].createElement(JianJie, introData), document.getElementById('jianjie'));
	});

/***/ }),

/***/ 159:
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// 登录判断与处理
	function loginCheck(loginData) {
	  var status = [100, 101, 102, 303];
	  if (!Array.indexOf) {
	    Array.prototype.indexOf = function (obj) {
	      for (var i = 0; i < this.length; i++) {
	        if (this[i] == obj) {
	          return i;
	        }
	      }
	      return -1;
	    };
	  }
	  if (status.indexOf(loginData.meta.result) === -1) {
	    alert(loginData.meta.msg);
	  }
	  if (loginData.meta.result == 303) {
	    confirm(loginData.meta.msg);
	    window.location.href = "https://ids.cqupt.edu.cn/authserver/login?service=" + courseCenter.host + "classList";
	  }
	}

	// 封装ajax(BluMUI.result.Title.props.ajaxing)
	var post_ajax = function post_ajax(options) {
	  options = options || {};
	  // options.dataType = "json";

	  //创建 - 非IE6 - 第一步
	  if (window.XMLHttpRequest) {
	    var xhr = new XMLHttpRequest();
	  } else {
	    //IE6及其以下版本浏览器
	    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	  }

	  //数据处理
	  var arr = [];
	  for (var name in options.data) {
	    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(options.data[name]));
	  }
	  var params = arr.join("&");

	  //连接 和 发送 - 第二步
	  xhr.open("POST", options.url, true);
	  //设置表单提交时的内容类型(注意头信息的UTF-8，不然后台会乱码)
	  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	  xhr.send(params);

	  //接收 - 第三步
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState == 4) {
	      var status = xhr.status;
	      if (status >= 200 && status < 300) {
	        loginCheck(JSON.parse(xhr.responseText));
	        options.success && options.success(xhr.responseText, xhr.responseXML);
	      } else {
	        options.fail && options.fail(status);
	      }
	    }
	  };
	};

	exports["default"] = post_ajax;
	module.exports = exports['default'];

/***/ })

});