webpackJsonp([6],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(147);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(1);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ajax = __webpack_require__(159);
	var Fanye = __webpack_require__(160);
	var _prefix = "wpgl-";
	var _COUNT = 10;

	var SET = function SET(key, value) {
	  sessionStorage.setItem(_prefix + key, value);
	  return value;
	};

	var GET = function GET(key) {
	  return sessionStorage.getItem(_prefix + key) || '';
	};

	var WPPCS = [];

	var Option = function (_React$Component) {
	  _inherits(Option, _React$Component);

	  function Option(props) {
	    _classCallCheck(this, Option);

	    var _this = _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).call(this, props));

	    _this.search_cache = {
	      wppc: GET("wppc")
	    };
	    _this.state = {
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      },
	      list: [],
	      wppc: GET("wppc"),
	      wppc_select: []
	    };
	    return _this;
	  }

	  _createClass(Option, [{
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this2 = this;

	      var page = p || +GET("page") || 1;

	      ajax({
	        url: courseCenter.host + "reviewList",
	        data: {
	          unifyCode: getCookie("userId"),
	          name: this.search_cache.wppc,
	          page: page,
	          count: _COUNT
	        },
	        success: function success(gets) {
	          SET("page", page);
	          var datas = JSON.parse(gets);
	          _this2.setState({
	            TP: {
	              page: page,
	              pages: datas.data.totalPages,
	              total: datas.data.total
	            },
	            list: datas.data.list
	          });
	        }
	      });
	    }
	  }, {
	    key: 'change_wppc',
	    value: function change_wppc(e) {
	      this.setState({
	        wppc: e ? e.target.value : this.state.wppc
	      }, this.search);
	    }
	  }, {
	    key: 'search',
	    value: function search() {
	      this.search_cache.wppc = SET("wppc", this.state.wppc);
	      this._get_list(1);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      return _react2["default"].createElement(
	        'div',
	        { id: 'wpgl_option' },
	        _react2["default"].createElement(
	          'div',
	          { id: 'option' },
	          _react2["default"].createElement(
	            'div',
	            { id: 'big_btns' },
	            _react2["default"].createElement(
	              'button',
	              { className: 'big_btn', ref: function ref(btn) {
	                  return _this3.fqwp = btn;
	                } },
	              '\u53D1\u8D77\u7F51\u8BC4'
	            ),
	            _react2["default"].createElement(
	              'button',
	              { className: 'big_btn', ref: function ref(btn) {
	                  return _this3.PLdelete = btn;
	                } },
	              '\u6279\u91CF\u5220\u9664'
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'filter_bar' },
	            _react2["default"].createElement(
	              'span',
	              { id: 'wppc' },
	              '\u7F51\u8BC4\u6279\u6B21\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'select',
	              {
	                name: 'wppc_select',
	                id: 'wppc_select',
	                ref: function ref(sel) {
	                  return _this3.wppc_select = sel;
	                },
	                value: this.state.wppc,
	                onChange: this.change_wppc.bind(this)
	              },
	              [_react2["default"].createElement(
	                'option',
	                { value: '', key: 'default' },
	                '\u8BF7\u9009\u62E9'
	              )].concat(this.state.wppc_select.map(function (op, index) {
	                return _react2["default"].createElement(
	                  'option',
	                  { value: op.wppc, key: index },
	                  op.wppc
	                );
	              }))
	            )
	          )
	        ),
	        _react2["default"].createElement(Lists, { ref: 'list', Lists: this.state.list }),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this3._get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'get_wppc_select',
	    value: function get_wppc_select() {
	      var _this4 = this;

	      // 填充网评批次下拉菜单
	      ajax({
	        url: courseCenter.host + "reviewBriefList",
	        data: {
	          userID: getCookie("userId"),
	          state: 1,
	          expGroup: ""
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          _this4.setState({
	            wppc_select: JSON.parse(gets).data.list
	          });
	        }
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this5 = this;

	      this.fqwp.onclick = function () {
	        window.location.href = './masterPublishWp.html';
	      };

	      this.get_wppc_select();
	      // // 首次查询列表并填充
	      this._get_list();

	      var pop = document.getElementById('popup');
	      // PiLiangDelete
	      this.PLdelete.onclick = function () {
	        Creat_popup('PLdelete', WPPCS, _this5.refs.list.ids);
	        pop.style.display = 'block';
	      };
	    }
	  }]);

	  return Option;
	}(_react2["default"].Component);

	var Lists = function (_React$Component2) {
	  _inherits(Lists, _React$Component2);

	  function Lists(props) {
	    _classCallCheck(this, Lists);

	    var _this6 = _possibleConstructorReturn(this, (Lists.__proto__ || Object.getPrototypeOf(Lists)).call(this, props));

	    _this6.ids = [];
	    return _this6;
	  }

	  _createClass(Lists, [{
	    key: 'create_head',
	    value: function create_head() {
	      var _this7 = this;

	      return _react2["default"].createElement(
	        'thead',
	        null,
	        _react2["default"].createElement(
	          'tr',
	          null,
	          _react2["default"].createElement(
	            'td',
	            { width: '25px', className: 'td_head' },
	            _react2["default"].createElement('div', null)
	          ),
	          _react2["default"].createElement('td', { width: '0px', className: 'td_left_space' }),
	          _react2["default"].createElement(
	            'td',
	            { width: '20px' },
	            _react2["default"].createElement('input', {
	              type: 'checkbox',
	              id: 'allcheck',
	              ref: function ref(check) {
	                return _this7.allcheck = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'allcheck' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            )
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            '\u7F51\u8BC4\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u5206\u7EC4\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u6307\u6807\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '13%' },
	            '\u4E13\u5BB6\u5206\u7EC4\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            '\u8D77\u6B62\u65F6\u95F4'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u5206\u914D\u8BFE\u7A0B'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u64CD\u4F5C'
	          ),
	          _react2["default"].createElement('td', { width: '0px', className: 'td_right_space' }),
	          _react2["default"].createElement(
	            'td',
	            { width: '25px', className: 'td_end' },
	            _react2["default"].createElement('div', null)
	          )
	        )
	      );
	    }
	  }, {
	    key: 'option',
	    value: function option(type, id, wppc, eve) {
	      eve.preventDefault();

	      switch (type) {
	        case 'delete':
	          Creat_popup('delete', wppc, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'fenpei':
	          window.location.href = './wpgl-fenpei.html?wppc=' + wppc + '&id=' + id;
	          break;
	        case 'jieguo':
	          window.location.href = './wpgl-jieguo.html?wppc=' + wppc + '&id=' + id;
	          break;
	        case 'edit':
	          window.location.href = './masterPublishWp.html?wpId=' + id + '&isEditor=true';
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'check',
	    value: function check(id, wppc, eve) {
	      this.allcheck.checked = false;
	      if (eve.target.checked) {
	        // add
	        this.ids.push(id);
	        WPPCS.push(wppc);
	      } else {
	        // delet
	        this.ids = this.ids.filter(function (e) {
	          return e !== id;
	        });
	        WPPCS = WPPCS.filter(function (e) {
	          return e !== wppc;
	        });
	      }
	    }
	  }, {
	    key: 'create_body',
	    value: function create_body() {
	      var _this8 = this;

	      if (this.props.Lists.length === 0) {
	        return _react2["default"].createElement(
	          'tbody',
	          null,
	          _react2["default"].createElement(
	            'tr',
	            null,
	            _react2["default"].createElement('td', { className: 'lefttd' }),
	            _react2["default"].createElement(
	              'td',
	              { colSpan: '7', style: { borderBottom: 'none' } },
	              _react2["default"].createElement('img', { id: 'err_img', src: '../../imgs/public/error.png' }),
	              _react2["default"].createElement(
	                'div',
	                null,
	                '\u6CA1\u6709\u6570\u636E'
	              )
	            ),
	            _react2["default"].createElement('td', { className: 'righttd' })
	          )
	        );
	      }

	      return _react2["default"].createElement(
	        'tbody',
	        null,
	        this.props.Lists.map(function (e, index) {
	          return _react2["default"].createElement(
	            'tr',
	            { key: index },
	            _react2["default"].createElement('td', { className: 'td_head' }),
	            _react2["default"].createElement('td', null),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement('input', {
	                type: 'checkbox',
	                id: "input-" + index,
	                value: e.id + "#" + e.wppc,
	                onChange: _this8.check.bind(_this8, e.id, e.wppc)
	              }),
	              _react2["default"].createElement(
	                'label',
	                { htmlFor: "input-" + index },
	                _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.wppc
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.fzpc
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.zbpc
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.zjfzpc
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.kssj + "-" + e.jssj
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'div',
	                null,
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'green_btn', onClick: _this8.option.bind(_this8, "fenpei", e.id, e.wppc) },
	                  '\u5206\u914D'
	                ),
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'green_btn', onClick: _this8.option.bind(_this8, "jieguo", e.id, e.wppc) },
	                  '\u7ED3\u679C'
	                )
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'div',
	                null,
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'green_btn', onClick: _this8.option.bind(_this8, "edit", e.id, e.wppc) },
	                  '\u7F16\u8F91'
	                ),
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'yellow_btn', onClick: _this8.option.bind(_this8, "delete", e.id, e.wppc) },
	                  '\u5220\u9664'
	                )
	              )
	            ),
	            _react2["default"].createElement('td', null),
	            _react2["default"].createElement('td', { className: 'td_end' })
	          );
	        })
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'wpgl_table' },
	        _react2["default"].createElement(
	          'table',
	          { ref: 'table' },
	          this.create_head(),
	          this.create_body()
	        )
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this9 = this;

	      this.allcheck.onchange = function (eve) {
	        _this9.ids = [];
	        WPPCS = [];
	        var checks = Array.from(document.querySelectorAll('tbody td input[type="checkbox"]'));
	        checks.map(function (e) {
	          (e.checked = eve.target.checked) && _this9.ids.push(e.value.split("#")[0]) && WPPCS.push(e.value.split("#")[1]);
	        });
	      };
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      if (window.frameElement) {
	        window.frameElement.height = document.body.offsetHeight;
	      }
	    }
	  }]);

	  return Lists;
	}(_react2["default"].Component);

	var Popup = function (_React$Component3) {
	  _inherits(Popup, _React$Component3);

	  function Popup(props) {
	    _classCallCheck(this, Popup);

	    return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));
	  }

	  _createClass(Popup, [{
	    key: 'render',
	    value: function render() {
	      var _this11 = this;

	      var _props = this.props,
	          type = _props.type,
	          names = _props.names;

	      var MAP = {
	        "PLdelete": "删除",
	        "delete": "删除"
	      };

	      switch (type) {
	        case 'PLdelete':
	        case 'delete':
	          return _react2["default"].createElement(
	            'div',
	            { id: 'popbody', ref: 'pb' },
	            _react2["default"].createElement(
	              'div',
	              { id: 'msg' },
	              _react2["default"].createElement(
	                'p',
	                null,
	                '\u786E\u5B9A\u8981' + (MAP[type] + names) + '?'
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'popup_option' },
	              _react2["default"].createElement(
	                'button',
	                { id: 'popup_OK', ref: function ref(btn) {
	                    return _this11.OK = btn;
	                  } },
	                '\u786E\u5B9A'
	              ),
	              _react2["default"].createElement(
	                'button',
	                { id: 'popup_back', ref: function ref(btn) {
	                    return _this11.back = btn;
	                  } },
	                '\u53D6\u6D88'
	              )
	            )
	          );
	          break;
	        default:
	          return _react2["default"].createElement('div', null);
	          break;
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _props2 = this.props,
	          id = _props2.id,
	          type = _props2.type;
	      // background click to cancel

	      this.refs.pb.onclick = function (e) {
	        return e.stopPropagation();
	      };
	      // back button click to cancel
	      this.back.onclick = cancel_popup;
	      // OK button option
	      var dat = {};

	      switch (type) {
	        case "PLdelete":
	        case "delete":
	          dat = {
	            unifyCode: getCookie("userId"),
	            ID: id
	          };
	          break;
	        default:
	          break;
	      }

	      this.OK.onclick = function () {
	        var data_map = {
	          "PLdelete": "deleteReview",
	          "delete": "deleteReview"
	        };
	        ajax({
	          url: courseCenter.host + data_map[type],
	          data: dat,
	          success: function success(gets) {
	            var datas = JSON.parse(gets);
	            if (datas.meta.result !== 100) {
	              return;
	            }
	            cancel_popup();
	            WPGL._get_list();
	            WPGL.get_wppc_select();
	          }
	        });
	      };

	      if (window.frameElement) {
	        var H = document.body.offsetHeight;
	        if (650 > parseInt(document.body.offsetHeight)) {
	          H = 650;
	        }
	        window.frameElement.height = H;
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (window.frameElement) {
	        window.frameElement.height = document.body.offsetHeight;
	      }
	    }

	    // componentDidUpdate(prevProps, prevState) {
	    //   if(window.frameElement) {
	    //     let H=document.body.offsetHeight;
	    //     if(this.refs.pb.offsetHeight>parseInt(document.body.offsetHeight)) {
	    //       H=this.refs.pb.offsetHeight;
	    //     }
	    //     window.frameElement.height=H;
	    //   }
	    // }

	  }]);

	  return Popup;
	}(_react2["default"].Component);

	function Creat_popup(type, names, id) {
	  var popup_datas = {
	    type: type,
	    names: names,
	    id: id
	  };
	  var popup = _reactDom2["default"].render(_react2["default"].createElement(Popup, popup_datas), document.getElementById('popup'));

	  // click to close popup
	  document.getElementById('popup').onclick = cancel_popup;
	}

	function cancel_popup() {
	  var popup = document.getElementById('popup');
	  popup.style.display = "none";
	  _reactDom2["default"].unmountComponentAtNode(popup);
	}

	var WPGL = _reactDom2["default"].render(_react2["default"].createElement(Option, null), document.getElementById('wpgl'));

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

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(147);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Fanye = function (_React$Component) {
	  _inherits(Fanye, _React$Component);

	  function Fanye(props) {
	    _classCallCheck(this, Fanye);

	    return _possibleConstructorReturn(this, (Fanye.__proto__ || Object.getPrototypeOf(Fanye)).call(this, props));
	  }

	  _createClass(Fanye, [{
	    key: 'create_popup_fanye',
	    value: function create_popup_fanye() {
	      var _this2 = this;

	      if (this.props.TP.pages < 1) {
	        return null;
	      }
	      if (this.props.TP.total === 0) {
	        return _react2["default"].createElement('div', { style: { height: '21px', padding: '30px 0' } });
	      }

	      var nums = [];
	      var start = 1;
	      var end = this.props.TP.pages || 1;
	      var now = this.props.TP.page || 1;
	      var page_on = { color: "#007A51" };

	      var change_page = function change_page(p) {
	        if (p === now) {
	          nums.push(_react2["default"].createElement(
	            'li',
	            { key: p, style: page_on },
	            p
	          ));
	        } else {
	          nums.push(_react2["default"].createElement(
	            'li',
	            { key: p, onClick: _this2.fanye.bind(_this2, p) },
	            p
	          ));
	        }
	      };

	      if (end < 1) {
	        nums.push(_react2["default"].createElement(
	          'li',
	          { key: 'only', onClick: this.fanye.bind(this, 1) },
	          '1'
	        ));
	      } else if (end <= 5) {
	        for (var i = 1; i <= end; i++) {
	          change_page(i);
	        }
	      } else {
	        if (now < 3) {
	          for (var _i = 1; _i <= 5; _i++) {
	            change_page(_i);
	          }
	        } else if (now > end - 3) {
	          for (var _i2 = end - 4; _i2 <= end; _i2++) {
	            change_page(_i2);
	          }
	        } else {
	          for (var _i3 = now - 2; _i3 <= now + 2; _i3++) {
	            change_page(_i3);
	          }
	        }
	      }

	      return _react2["default"].createElement(
	        'div',
	        { className: 'fanye' },
	        _react2["default"].createElement(
	          'span',
	          { className: 'total' },
	          '\u5171',
	          this.props.TP.total >= 0 ? this.props.TP.total : 1,
	          '\u6761\u8BB0\u5F55'
	        ),
	        _react2["default"].createElement('input', { className: 'fanye_options fanye_start', type: 'button', value: '\u9996\u9875', onClick: this.fanye.bind(this, now === 1 ? 0 : 1) }),
	        _react2["default"].createElement('input', { className: 'fanye_options fanye_pre', type: 'button', value: '\u4E0A\u4E00\u9875', onClick: this.fanye.bind(this, now === 1 ? 0 : now - 1) }),
	        _react2["default"].createElement(
	          'ul',
	          { className: 'fanye_nums' },
	          nums
	        ),
	        _react2["default"].createElement('input', { type: 'text', className: 'tp', ref: 'tp', placeholder: this.props.TP.page + '/' + this.props.TP.pages }),
	        _react2["default"].createElement('input', { className: 'fanye_options fanye_next', type: 'button', value: '\u4E0B\u4E00\u9875', onClick: this.fanye.bind(this, now === end ? 0 : now + 1) }),
	        _react2["default"].createElement('input', { className: 'fanye_options fanye_end', type: 'button', value: '\u5C3E\u9875', onClick: this.fanye.bind(this, now === end ? 0 : end) })
	      );
	    }
	  }, {
	    key: 'fanye',
	    value: function fanye(p) {
	      if (!this.refs.tp) {
	        return;
	      }
	      this.refs.tp.value = null;
	      if (p == 0) {
	        return;
	      }
	      this.props.callback(p);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.create_popup_fanye();
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this3 = this;

	      if (!this.refs.tp) {
	        return;
	      }
	      // 手动跳转翻页
	      this.refs.tp.onkeydown = function (eve) {
	        if (eve.keyCode === 13) {
	          var newpage = +eve.target.value;
	          if (!isNaN(newpage)) {
	            if (newpage >= 1 && newpage <= _this3.props.TP.pages) {
	              _this3.fanye(newpage);
	            } else {
	              eve.target.value = null;
	            }
	          } else {
	            eve.target.value = null;
	          }
	          eve.target.blur();
	        }
	      };
	    }
	  }]);

	  return Fanye;
	}(_react2["default"].Component);

	exports["default"] = Fanye;
	module.exports = exports['default'];

/***/ })

});