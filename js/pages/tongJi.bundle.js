webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BluMUI = __webpack_require__(1);
	var ajax = __webpack_require__(160);

	var menues = [];
	var menue_names = BluMUI.menue_names;

	ajax({
	  url: courseCenter.host + 'getMenu',
	  data: {
	    // module=9:规章制度，module=10：统计分析
	    module: 10,
	    unifyCode: getCookie('userId')
	  },
	  success: function success(gets) {
	    var datas = JSON.parse(gets);
	    menues = [];
	    datas.data.map(function (e) {
	      menues.push(e.subModule);
	      menue_names[e.subModule] = e.cdmc;
	    });

	    // just test


	    // 左边的菜单
	    BluMUI.create({
	      Menues: menues
	    }, 'Create_menu', document.getElementById('menue'));
	  }
	});

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

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
	var Menue_this;

	// iframe

	var Iframe = function (_React$Component) {
	  _inherits(Iframe, _React$Component);

	  function Iframe(props) {
	    _classCallCheck(this, Iframe);

	    var _this = _possibleConstructorReturn(this, (Iframe.__proto__ || Object.getPrototypeOf(Iframe)).call(this, props));

	    _this.state = _this.props;
	    _this.iframes = { length: 0 };
	    Object.defineProperty(_this.iframes, "length", {
	      enumerable: false
	    });
	    _this.state.tabs.map(function (e, index) {
	      _this.iframes[e] = _react2["default"].createElement('iframe', { src: '../systemManage/' + e + '.html', frameBorder: '0', id: 'ifs-' + e, key: e, style: { display: 'none' }, onLoad: _this.ld.bind(_this) });
	      _this.iframes.length++;
	    });
	    return _this;
	  }

	  _createClass(Iframe, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this2 = this;

	      if (nextProps.tabs.length == this.iframes.length) {} else if (nextProps.tabs.length > this.iframes.length) {
	        nextProps.tabs.map(function (e) {
	          if (typeof _this2.iframes[e] == 'undefined') {
	            _this2.iframes[e] = _react2["default"].createElement('iframe', { src: '../systemManage/' + e + '.html', frameBorder: '0', id: 'ifs-' + e, key: e, style: { display: 'none' }, onLoad: _this2.ld.bind(_this2) });
	            _this2.iframes.length++;
	          }
	        });
	      } else if (nextProps.tabs.length < this.iframes.length) {
	        for (var i in this.iframes) {
	          if (-1 == nextProps.tabs.indexOf(i)) {
	            delete this.iframes[i];
	            this.iframes.length--;
	          }
	        }
	      }
	      document.getElementById('ifs-' + this.state.on).style.display = 'none';
	      this.setState(nextProps);
	    }
	  }, {
	    key: 'ld',
	    value: function ld() {
	      // 从外面设置iframe的高度
	      iframe_set('ifs-' + this.state.on);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.render();
	      document.getElementById('ifs-' + this.state.on).style.display = 'block';
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      document.getElementById('ifs-' + this.state.on).style.display = 'block';
	    }
	  }, {
	    key: 'create_iframes',
	    value: function create_iframes() {
	      var IFS = [];
	      for (var i in this.iframes) {
	        IFS.push(this.iframes[i]);
	      }
	      return _react2["default"].createElement(
	        'div',
	        { id: 'iframes', ref: 'Iframe' },
	        IFS
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.create_iframes();
	    }
	  }]);

	  return Iframe;
	}(_react2["default"].Component);

	function iframe_set(elem) {
	  var child_iframe = document.getElementById(elem);
	  child_iframe.height = child_iframe.contentWindow.document.body.scrollHeight;
	}

	// 菜单

	var Menue = function (_React$Component2) {
	  _inherits(Menue, _React$Component2);

	  function Menue(props) {
	    _classCallCheck(this, Menue);

	    // 设置默认显示的第一个tab
	    var _this3 = _possibleConstructorReturn(this, (Menue.__proto__ || Object.getPrototypeOf(Menue)).call(this, props));

	    _this3.state = {
	      Menue_on: _this3.props.Menues[0]
	    };
	    return _this3;
	  }

	  _createClass(Menue, [{
	    key: 'tab_change',
	    value: function tab_change(name, eve) {
	      var _this4 = this;

	      this.setState({
	        Menue_on: name
	      }, function () {
	        Create_tabs(_this4.state.Menue_on);
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      Menue_this = this;
	      this.refs.menue.children[0].className = 'menue_on';
	      Create_tabs(this.state.Menue_on);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(preProps, preState) {
	      this.refs.menue.children[this.props.Menues.indexOf(preState.Menue_on)].className = '';
	      this.refs.menue.children[this.props.Menues.indexOf(this.state.Menue_on)].className = 'menue_on';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this5 = this;

	      return _react2["default"].createElement(
	        'ul',
	        { ref: 'menue' },
	        this.props.Menues.map(function (e, index) {
	          return _react2["default"].createElement(
	            'li',
	            { key: index, name: e, onClick: _this5.tab_change.bind(_this5, e) },
	            BluMUI.menue_names[e]
	          );
	        })
	      );
	    }
	  }]);

	  return Menue;
	}(_react2["default"].Component);

	// tabs


	var Tab_head = function (_React$Component3) {
	  _inherits(Tab_head, _React$Component3);

	  function Tab_head(props) {
	    _classCallCheck(this, Tab_head);

	    var _this6 = _possibleConstructorReturn(this, (Tab_head.__proto__ || Object.getPrototypeOf(Tab_head)).call(this, props));

	    _this6.state = {
	      tabs: [_this6.props.Tab],
	      on: _this6.props.Tab
	    };
	    return _this6;
	  }

	  _createClass(Tab_head, [{
	    key: 'tab_change',
	    value: function tab_change(tab_name, eve) {
	      this.refs[this.state.on].className = '';
	      this.setState({ on: tab_name });
	      Menue_this.setState({ Menue_on: tab_name });
	    }
	  }, {
	    key: 'del',
	    value: function del(tab_name, eve) {
	      eve.nativeEvent.preventDefault();
	      var tabs = this.state.tabs;
	      var index = tabs.indexOf(tab_name);
	      var new_on = void 0;
	      tabs.splice(index, 1);
	      if (index < 1) {
	        new_on = tabs[index + 1];
	      } else {
	        new_on = tabs[index - 1];
	      }
	      this.setState({
	        tabs: tabs,
	        on: new_on
	      });
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var new_tabs = this.state.tabs;
	      if (this.state.tabs.indexOf(nextProps.Tab) == -1) {
	        new_tabs.push(nextProps.Tab);
	      }
	      this.setState({
	        tabs: new_tabs,
	        on: nextProps.Tab
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      Create_iframes(this.state);
	      this.refs[this.state.on].className = 'tabs_on';
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(preProps, preState) {
	      var _this7 = this;

	      Create_iframes(this.state);
	      if (this.refs[preState.on]) {
	        this.refs[preState.on].className = '';
	      }
	      this.refs[this.state.on].className = 'tabs_on';
	      // 为关闭按钮单独绑定事件，不单独绑定会触发事件冒泡
	      Array().map.call(this.refs.tabs.getElementsByClassName('close'), function (e, index) {
	        e.onclick = function (eve) {
	          // 阻止事件冒泡
	          eve.stopImmediatePropagation();
	          var new_on = _this7.state.on;
	          var tabs = _this7.state.tabs;
	          // 如果只有一个tab被打开则这个tab不能关闭
	          if (tabs.length == 1) {
	            return;
	          }
	          // 将当前打开的标签设置为关闭
	          _this7.refs[_this7.state.on].className = '';
	          // 如果关闭的tab和当前打开的tab是同一个
	          if (tabs[index] == _this7.state.on) {
	            // 看是不是关闭的第一个tab，是第一个就打开后面个
	            tabs.splice(index, 1);
	            new_on = tabs[tabs.length - 1];
	          } else {
	            tabs.splice(index, 1);
	          }
	          _this7.setState({
	            tabs: tabs,
	            on: new_on
	          });
	          Menue_this.setState({ Menue_on: new_on });
	        };
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this8 = this;

	      //需要this.state向下传递信息，包括tab[]和on
	      return _react2["default"].createElement(
	        'ul',
	        { ref: 'tabs' },
	        this.state.tabs.map(function (e, index) {
	          return _react2["default"].createElement(
	            'li',
	            { key: index, ref: e, onClick: _this8.tab_change.bind(_this8, e) },
	            BluMUI.menue_names[e],
	            _react2["default"].createElement(
	              'span',
	              { className: 'close' },
	              'x'
	            )
	          );
	        })
	      );
	    }
	  }]);

	  return Tab_head;
	}(_react2["default"].Component);

	function Create_tabs(tab) {
	  BluMUI.create({
	    Tab: tab
	  }, 'Create_tab', document.getElementById('tabs'));
	}

	function Create_iframes(state) {
	  BluMUI.create(state, 'Create_iframe', document.getElementById('tab'));
	}

	// ----------------------------------------------------------------------------------------------------
	var BluMUI_M = {
	  Create_menu: Menue,
	  Create_iframe: Iframe,
	  Create_tab: Tab_head

	};

	var BluMUI = {
	  result: {},
	  menue_names: {},
	  create: function create(data, type, elem) {
	    var props = data,
	        Blu = BluMUI_M[type];
	    this.result[props.id] = _reactDom2["default"].render(_react2["default"].createElement(Blu, props), elem);
	  }
	};

	exports["default"] = BluMUI;
	module.exports = exports['default'];

/***/ }),

/***/ 160:
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