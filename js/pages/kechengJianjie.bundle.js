webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BluMUI = __webpack_require__(1);
	var ajax = __webpack_require__(160);
	var Place = 3;
	// var url_place=parseHash(window.location.href);
	// if("place" in url_place) {
	//   Place = url_place.place;
	// }
	/*

	 院长：0102295 Cq011568 (黄容)
	教研室主任：0102549  251833（罗婷婷）
	课程负责人：0102387 密码caiting@cqupt（蔡婷）
	教师：0102295 0102549   0102387 
	欢迎页面
	http://172.20.2.137/subjectCenter/CquptCourseCenter/index.html
	课程编号： A1040040  A2040080  A2040020  
	 */
	var User = {
	  id: ''
	};
	var Course = {
	  kcbh: ''
	};
	User.id = getCookie('userId');
	Course.kcbh = parseHash(window.location.href).classId;

	BluMUI.result.unifyCode = User.id;

	ajax({
	  url: courseCenter.host + 'getCourseIntroducePageMsg',
	  data: {
	    kcbh: Course.kcbh,
	    unifyCode: User.id,
	    place: Place
	  },
	  success: function success(gets) {
	    var datas = JSON.parse(gets);
	    if (datas.meta.result == 101) {
	      window.location.href = 'error1.html';
	    } else if (datas.meta.result == 102) {
	      window.location.href = 'error2.html';
	    }
	    if (!datas.data || datas.data[0].kcjshtml == '') {
	      // window.location.href='error.html';
	      document.getElementById('jianjie').innerHTML = '<p style="text-align:center;">没有课程简介</p>';
	    } else {
	      document.getElementById('jianjie').innerHTML = datas.data[0].kcjshtml;
	    }
	  }
	});

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ajax = __webpack_require__(160);

	var BluMUI_CreateJianjie = function (_React$Component) {
	  _inherits(BluMUI_CreateJianjie, _React$Component);

	  function BluMUI_CreateJianjie(props) {
	    _classCallCheck(this, BluMUI_CreateJianjie);

	    return _possibleConstructorReturn(this, (BluMUI_CreateJianjie.__proto__ || Object.getPrototypeOf(BluMUI_CreateJianjie)).call(this, props));
	  }

	  _createClass(BluMUI_CreateJianjie, [{
	    key: 'render',
	    value: function render() {
	      var JS = void 0;
	      if (this.props.Jianjie == '') {
	        JS = _react2["default"].createElement(
	          'p',
	          { style: { textAlign: 'center' } },
	          '\u6CA1\u6709\u6570\u636E\uFF01'
	        );
	      } else {
	        JS = this.props.Jianjie;
	      }
	      return _react2["default"].createElement(
	        'div',
	        null,
	        JS
	      );
	    }
	  }]);

	  return BluMUI_CreateJianjie;
	}(_react2["default"].Component);

	var BluMUI_M = {
	  Create_jianjie: BluMUI_CreateJianjie
	};

	var BluMUI = {
	  result: {},
	  create: function create(data, type, elem) {
	    var props = data,
	        Blu = BluMUI_M[type];
	    this.result[props.id] = _reactDom2["default"].render(_react2["default"].createElement(Blu, props), elem);
	  }
	};

	exports["default"] = BluMUI;
	module.exports = exports['default'];

/***/ },

/***/ 160:
/***/ function(module, exports) {

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

/***/ }

});