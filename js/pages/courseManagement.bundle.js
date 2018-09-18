webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BluMUI = __webpack_require__(1);
	var ajax = __webpack_require__(160);

	// 此处需要获取角色ID
	var User = {
	  id: ''
	};
	User.id = getCookie('userId');
	BluMUI.result.unifyCode = User.id;

	//获取subModule(tab)

	ajax({
	  menue: true,
	  url: courseCenter.host + "getMenu",
	  data: {
	    unifyCode: User.id,
	    module: 4
	  },
	  success: function success(gets) {
	    // 未获取到数据则刷新页面
	    if (JSON.parse(gets).meta.result != 100) {
	      alert("数据获取失败，请重新登录！");
	    }
	    //渲染tabs
	    BluMUI.create({
	      id: 'Tab',
	      tabs: JSON.parse(gets).data
	    }, 'Create_tabs', document.getElementById('React_tab'));

	    //渲染options
	    BluMUI.create({
	      id: 'Options',
	      subModule: parseHash(window.location.href).subModule || BluMUI.result.Tab.state.subModule
	    }, 'Create_options', document.getElementById('React_options'));
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
	var OUT_COUNT = 10;

	// 独立页面--------------------------------------------------------------
	var Kcfzgl_option = '';
	var _COUNT = 10;

	var SET = function SET(key, value) {
	  sessionStorage.setItem("kcfzgl-" + key, value);
	  return value;
	};

	var GET = function GET(key) {
	  return sessionStorage.getItem("kcfzgl-" + key) || '';
	};

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

	var Option = function (_React$Component2) {
	  _inherits(Option, _React$Component2);

	  function Option(props) {
	    _classCallCheck(this, Option);

	    // read cache
	    var _this4 = _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).call(this, props));

	    _this4.search_cache = {
	      wppc: GET("wppc"),
	      fzx: GET("fzx"),
	      kcmc: GET("kcmc")
	    };

	    _this4.state = {
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      },
	      list: [],

	      wppc: GET("wppc"),
	      fzx: GET("fzx"),
	      kcmc: GET("kcmc"),
	      wppc_select: [],
	      fzx_select: []
	    };
	    return _this4;
	  }

	  _createClass(Option, [{
	    key: 'search',
	    value: function search() {
	      // cache search datas
	      this.search_cache = {
	        wppc: SET('wppc', this.state.wppc),
	        fzx: SET('fzx', this.state.fzx),
	        kcmc: SET('kcmc', this.state.kcmc)
	      };
	      this._get_list(1);
	    }
	  }, {
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this5 = this;

	      var page = p || +GET("page") || 1;

	      ajax({
	        url: courseCenter.host + "getKcfzList",
	        data: {
	          unifyCode: getCookie('userId'),
	          reviewBatch: this.search_cache.wppc,
	          courseName: this.search_cache.kcmc,
	          group: this.search_cache.fzx,
	          count: _COUNT,
	          page: page
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          SET("page", page);
	          _this5.setState({
	            TP: {
	              page: page,
	              pages: datas.data.totalPages,
	              total: datas.data.total
	            },
	            list: datas.data.courseGroupList
	          });
	        }
	      });
	    }
	  }, {
	    key: 'change_wppc',
	    value: function change_wppc(e) {
	      var _this6 = this;

	      var reviewBatch = void 0,
	          fzx = void 0;
	      if (e) {
	        // handle trriger
	        fzx = "";
	        reviewBatch = e.target.value;
	        // sessionStorage.removeItem("fzx");
	      } else {
	        // auto trriger
	        fzx = this.search_cache.fzx;
	        reviewBatch = this.state.wppc;
	      }
	      this.setState({
	        wppc: reviewBatch
	      }, function () {
	        _this6.search();
	      });

	      // charge fzx select list
	      ajax({
	        url: courseCenter.host + "getFzxByWppc",
	        data: {
	          unifyCode: getCookie("userId"),
	          reviewBatch: reviewBatch
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result !== 100) {
	            _this6.setState({
	              fzx: fzx,
	              fzx_select: []
	            });
	          } else {
	            _this6.setState({
	              fzx: fzx,
	              fzx_select: datas.data
	            });
	          }
	        }
	      });
	    }
	  }, {
	    key: 'change_fzx',
	    value: function change_fzx(e) {
	      var _this7 = this;

	      this.setState({
	        fzx: e.target.value
	      }, function () {
	        _this7.search();
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this8 = this;

	      return _react2["default"].createElement(
	        'div',
	        { id: 'Option_react' },
	        _react2["default"].createElement(
	          'div',
	          { id: 'option' },
	          _react2["default"].createElement(
	            'div',
	            { id: 'down' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u7F51\u8BC4\u6279\u6B21\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'select',
	              {
	                name: 'wppc_select',
	                id: 'wppc_select',
	                ref: function ref(sel) {
	                  return _this8.wppc_select = sel;
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
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u5206\u7EC4\u9879\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'select',
	              {
	                name: 'fzx_select',
	                id: 'fzx_select',
	                ref: function ref(sel) {
	                  return _this8.fzx_select = sel;
	                },
	                value: this.state.fzx,
	                onChange: this.change_fzx.bind(this)
	              },
	              [_react2["default"].createElement(
	                'option',
	                { value: '', key: 'default' },
	                '\u8BF7\u9009\u62E9'
	              )].concat(this.state.fzx_select.map(function (op, index) {
	                return _react2["default"].createElement(
	                  'option',
	                  { value: op.fzx, key: index },
	                  op.fzx
	                );
	              }))
	            )
	          )
	        ),
	        _react2["default"].createElement(List, { list: this.state.list }),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this8._get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this9 = this;

	      // charge wppc select
	      ajax({
	        url: courseCenter.host + "reviewBriefList",
	        data: {
	          userID: getCookie('userId'),
	          state: 1,
	          expGroup: ''
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result === 100) {
	            _this9.setState({
	              wppc_select: datas.data.list
	            });
	          } else {
	            _this9.setState({
	              wppc_select: []
	            });
	          }
	        }
	      });
	      this.change_wppc();

	      this._get_list();
	    }
	  }]);

	  return Option;
	}(_react2["default"].Component);

	var List = function (_React$Component3) {
	  _inherits(List, _React$Component3);

	  function List(props) {
	    _classCallCheck(this, List);

	    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));
	  }

	  _createClass(List, [{
	    key: 'creat_thead',
	    value: function creat_thead() {
	      return _react2["default"].createElement(
	        'thead',
	        null,
	        _react2["default"].createElement(
	          'tr',
	          null,
	          _react2["default"].createElement(
	            'td',
	            { className: 'lefttd' },
	            _react2["default"].createElement('div', null)
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u7F51\u8BC4\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '15%' },
	            '\u5206\u7EC4\u6279\u6B21'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '15%' },
	            '\u5206\u7EC4\u9879'
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            '\u8BFE\u7A0B\u5217\u8868'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u64CD\u4F5C'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { className: 'righttd' },
	            _react2["default"].createElement('div', null)
	          )
	        )
	      );
	    }
	  }, {
	    key: 'option',
	    value: function option(type, data, data2, data3, eve) {
	      eve.preventDefault();
	      switch (type) {
	        case 'edit':
	          window.location.href = './materCourseSort.html?fzx=' + data2 + '&wppc=' + data + '&wppcId=' + data3;
	          break;
	        case 'delete':
	          Creat_popup('delete', data);
	          break;
	        case 'show':
	          Creat_popup('show', data.map(function (e) {
	            return e.kcmc;
	          }));
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'creat_tbody',
	    value: function creat_tbody() {
	      var _this11 = this;

	      return _react2["default"].createElement(
	        'tbody',
	        null,
	        this.props.list.map(function (e, index) {
	          return _react2["default"].createElement(
	            'tr',
	            { key: index },
	            _react2["default"].createElement('td', { className: 'lefttd' }),
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
	              e.fzx
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'span',
	                { className: 'kcmc_num' },
	                '[' + e.kcs + ']'
	              ),
	              _react2["default"].createElement(
	                'span',
	                { className: 'kcmc_list', onClick: _this11.option.bind(_this11, 'show', e.courseList, e.fzx, e.wpid) },
	                +e.kcmcs > 3 ? e.courseList.map(function (kcmc, kcmcNo) {
	                  return kcmcNo < 3 && _react2["default"].createElement(
	                    'span',
	                    { key: kcmcNo, className: 'kcmc_name' },
	                    kcmc.xm
	                  );
	                }).concat(_react2["default"].createElement(
	                  'span',
	                  { key: 'dot' },
	                  '\u2026\u2026'
	                )) : e.courseList.map(function (kcmc, kcmcNo) {
	                  return _react2["default"].createElement(
	                    'span',
	                    { key: kcmcNo, className: 'kcmc_name' },
	                    kcmc.kcmc
	                  );
	                })
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'a',
	                { href: '#', onClick: _this11.option.bind(_this11, 'edit', e.wppc, e.fzx, e.wpid) },
	                '\u7F16\u8F91'
	              )
	            ),
	            _react2["default"].createElement('td', { className: 'righttd' })
	          );
	        })
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'List' },
	        _react2["default"].createElement(
	          'table',
	          null,
	          this.creat_thead(),
	          this.creat_tbody()
	        )
	      );
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      if (window.frameElement) {
	        window.frameElement.height = document.body.offsetHeight;
	      }
	    }
	  }]);

	  return List;
	}(_react2["default"].Component);

	var Popup = function (_React$Component4) {
	  _inherits(Popup, _React$Component4);

	  function Popup(props) {
	    _classCallCheck(this, Popup);

	    return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));
	  }

	  _createClass(Popup, [{
	    key: 'render',
	    value: function render() {
	      var _this13 = this;

	      var _props = this.props,
	          type = _props.type,
	          id = _props.id;

	      var MAP = {
	        "delete": "删除"
	      };

	      switch (type) {
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
	                '\u786E\u5B9A\u8981' + (MAP[type] + id) + '?'
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'popup_option' },
	              _react2["default"].createElement(
	                'button',
	                { id: 'popup_OK', ref: function ref(btn) {
	                    return _this13.OK = btn;
	                  } },
	                '\u786E\u5B9A'
	              ),
	              _react2["default"].createElement(
	                'button',
	                { id: 'popup_back', ref: function ref(btn) {
	                    return _this13.back = btn;
	                  } },
	                '\u53D6\u6D88'
	              )
	            )
	          );
	          break;
	        case 'show':
	          return _react2["default"].createElement(
	            'div',
	            { id: 'popbody', ref: 'pb' },
	            _react2["default"].createElement(
	              'div',
	              { id: 'kcmcs' },
	              id.map(function (kcmc, index) {
	                return _react2["default"].createElement(
	                  'span',
	                  { key: index, className: 'kcmc' },
	                  kcmc
	                );
	              })
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
	      var dat = {};

	      switch (type) {
	        case "delete":
	          dat = {
	            unifyCode: getCookie("userId"),
	            reviewId: id
	          };
	          break;
	        default:
	          break;
	      }

	      // back button click to cancel
	      this.back && (this.back.onclick = cancel_popup);
	      // OK button option
	      this.OK && (this.OK.onclick = function () {
	        var data_map = {
	          "delete": "deleteKcfz"
	        };
	        ajax({
	          url: courseCenter.host + data_map[type],
	          data: dat,
	          success: function success(gets) {
	            var datas = JSON.parse(gets);
	            if (datas.meta.result == 100) {
	              cancel_popup();
	              Kcfzgl_option._get_list();
	            }
	          }
	        });
	      });
	    }
	  }]);

	  return Popup;
	}(_react2["default"].Component);

	function Creat_popup(type, id) {
	  var popupB = document.getElementById('popup-b');
	  var popup_datas = {
	    type: type,
	    id: id
	  };
	  _reactDom2["default"].render(_react2["default"].createElement(Popup, popup_datas), document.getElementById('popup-b'));
	  // click to close popup
	  popupB.style.display = "block";
	  popupB.onclick = cancel_popup;
	}

	function cancel_popup() {
	  var popupB = document.getElementById('popup-b');
	  popupB.style.display = "none";
	  _reactDom2["default"].unmountComponentAtNode(popupB);
	}

	// var Kcfzgl_option=ReactDOM.render(
	//   <Option />,
	//   document.getElementById('kcfzgl')
	// );
	// 独立页面--------------------------------------------------------------


	/**
	 * ******************课程管理******************
	 */

	var BlueMUI_CreateFanye = function (_React$Component5) {
	  _inherits(BlueMUI_CreateFanye, _React$Component5);

	  function BlueMUI_CreateFanye(props) {
	    _classCallCheck(this, BlueMUI_CreateFanye);

	    var _this14 = _possibleConstructorReturn(this, (BlueMUI_CreateFanye.__proto__ || Object.getPrototypeOf(BlueMUI_CreateFanye)).call(this, props));

	    _this14.fanye = _this14.fanye.bind(_this14);
	    _this14.create_popup_fanye = _this14.create_popup_fanye.bind(_this14);
	    return _this14;
	  }

	  _createClass(BlueMUI_CreateFanye, [{
	    key: 'create_popup_fanye',
	    value: function create_popup_fanye() {
	      var style = {};
	      var fanye = [];
	      var start = 1;
	      var end = this.props.pages;
	      var style_on = {
	        background: "url('../../imgs/courseAudit/fanye_bg.png')",
	        backgroundRepeat: 'no-repeat',
	        backgroundPosition: '5px 5px',
	        color: '#FFF'
	      };
	      if (this.props.pages < 1) {
	        return _react2["default"].createElement('div', null);
	      }
	      if (this.props.pages <= 7) {
	        for (var i = 2; i < this.props.pages; i++) {
	          if (i == this.props.page) {
	            style = style_on;
	          } else {
	            style = {};
	          }
	          fanye.push(_react2["default"].createElement(
	            'li',
	            { key: i, style: style, onClick: this.fanye.bind(this, i) },
	            i
	          ));
	        }
	      } else {
	        if (this.props.page < 5) {
	          for (var j = 2; j <= 6; j++) {
	            if (j == this.props.page) {
	              style = style_on;
	            } else {
	              style = {};
	            }
	            fanye.push(_react2["default"].createElement(
	              'li',
	              { key: j, style: style, onClick: this.fanye.bind(this, j) },
	              j
	            ));
	          }
	          fanye.push(_react2["default"].createElement(
	            'li',
	            { key: 'end' },
	            '...'
	          ));
	        } else if (this.props.page > this.props.pages - 4) {
	          for (var k = this.props.pages - 5; k < this.props.pages; k++) {
	            if (k == this.props.page) {
	              style = style_on;
	            } else {
	              style = {};
	            }
	            fanye.push(_react2["default"].createElement(
	              'li',
	              { key: k, style: style, onClick: this.fanye.bind(this, k) },
	              k
	            ));
	          }
	          fanye.unshift(_react2["default"].createElement(
	            'li',
	            { key: 'start' },
	            '...'
	          ));
	        } else {
	          for (var l = this.props.page - 2; l <= this.props.page + 2; l++) {
	            if (l == this.props.page) {
	              style = style_on;
	            } else {
	              style = {};
	            }
	            fanye.push(_react2["default"].createElement(
	              'li',
	              { key: l, style: style, onClick: this.fanye.bind(this, l) },
	              l
	            ));
	          }
	          fanye.unshift(_react2["default"].createElement(
	            'li',
	            { key: 'start' },
	            '...'
	          ));
	          fanye.push(_react2["default"].createElement(
	            'li',
	            { key: 'end' },
	            '...'
	          ));
	        }
	      }
	      if (1 == this.props.pages) {
	        fanye.push(_react2["default"].createElement(
	          'li',
	          { key: 1, style: style_on },
	          1
	        ));
	      } else if (this.props.page == this.props.pages) {
	        fanye.unshift(_react2["default"].createElement(
	          'li',
	          { key: 1, onClick: this.fanye.bind(this, 1) },
	          1
	        ));
	        fanye.push(_react2["default"].createElement(
	          'li',
	          { key: this.props.pages, style: style_on },
	          this.props.pages
	        ));
	      } else if (this.props.page == 1) {
	        fanye.unshift(_react2["default"].createElement(
	          'li',
	          { key: 1, style: style_on },
	          1
	        ));
	        fanye.push(_react2["default"].createElement(
	          'li',
	          { key: this.props.pages, onClick: this.fanye.bind(this, this.props.pages) },
	          this.props.pages
	        ));
	      } else {
	        fanye.unshift(_react2["default"].createElement(
	          'li',
	          { key: 1, onClick: this.fanye.bind(this, 1) },
	          1
	        ));
	        fanye.push(_react2["default"].createElement(
	          'li',
	          { key: this.props.pages, onClick: this.fanye.bind(this, this.props.pages) },
	          this.props.pages
	        ));
	      }
	      return _react2["default"].createElement(
	        'div',
	        { id: this.props.id },
	        _react2["default"].createElement(
	          'div',
	          { id: 'fanye_pre', ref: 'pre', onClick: this.fanye.bind(this, this.props.page - 1 < 1 ? 0 : this.props.page - 1) },
	          _react2["default"].createElement('img', { src: '../../imgs/courseAudit/fanye_left.png', alt: '' })
	        ),
	        _react2["default"].createElement(
	          'ul',
	          { ref: 'popup_fanye' },
	          fanye
	        ),
	        _react2["default"].createElement(
	          'div',
	          { id: 'fanye_next', ref: 'next', onClick: this.fanye.bind(this, this.props.page + 1 > this.props.pages ? 0 : this.props.page + 1) },
	          _react2["default"].createElement('img', { src: '../../imgs/courseAudit/fanye_right.png', alt: '' })
	        )
	      );
	    }
	  }, {
	    key: 'fanye',
	    value: function fanye(p) {
	      if (p == 0 || BluMUI.result.Tab.state.subModule === 'kcfz') {
	        return;
	      }
	      Array().map.call(document.getElementById('center_table').getElementsByTagName('input'), function (e) {
	        e.checked = false;
	      });
	      this.props.This.setState({ page: p });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.create_popup_fanye();
	    }
	  }]);

	  return BlueMUI_CreateFanye;
	}(_react2["default"].Component);

	//入口(tabs)


	var BlueMUI_CreateTabs = function (_React$Component6) {
	  _inherits(BlueMUI_CreateTabs, _React$Component6);

	  function BlueMUI_CreateTabs(props) {
	    _classCallCheck(this, BlueMUI_CreateTabs);

	    var _this15 = _possibleConstructorReturn(this, (BlueMUI_CreateTabs.__proto__ || Object.getPrototypeOf(BlueMUI_CreateTabs)).call(this, props));

	    _this15.state = {
	      subModule: parseHash(window.location.href).subModule || _this15.props.tabs[0].subModule
	    };
	    return _this15;
	  }

	  _createClass(BlueMUI_CreateTabs, [{
	    key: 'change_subModule',
	    value: function change_subModule(Module) {
	      this.setState({ subModule: Module });
	      if (BluMUI.result.Options) {
	        BluMUI.result.Options.setState({
	          subModule: Module,
	          page: 1
	        });
	      }

	      // 清空搜索内容
	      if (document.getElementById('jxtdss')) {
	        document.getElementById('jxtdss').value = '';
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this16 = this;

	      var tabs = [];

	      if (this.props.tabs.length > 0) {
	        this.props.tabs.map(function (e, index) {
	          tabs.push(_react2["default"].createElement(
	            'li',
	            { key: e.subModule, ref: e.subModule, onClick: _this16.change_subModule.bind(_this16, e.subModule) },
	            e.cdmc
	          ));
	          tabs.push(_react2["default"].createElement('li', { key: 'tab_line' + index, className: 'tab_line' }));
	        });
	        tabs.pop();
	      } else {
	        alert("数据获取失败，请刷新页面！");
	      }
	      return _react2["default"].createElement(
	        'div',
	        { id: 'tabs' },
	        _react2["default"].createElement(
	          'ul',
	          { id: 'tab', ref: 'tabs' },
	          tabs
	        )
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.refs[this.state.subModule].style.color = '#009361';
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      var end = this.refs.tabs.children.length;
	      for (var i = 0; i < end; i++) {
	        this.refs.tabs.children[i].style.color = '#999999';
	      }
	      this.refs[nextState.subModule].style.color = '#009361';
	    }
	  }]);

	  return BlueMUI_CreateTabs;
	}(_react2["default"].Component);

	//显示options(6个过滤条件)


	var BlueMUI_CreateOptions = function (_React$Component7) {
	  _inherits(BlueMUI_CreateOptions, _React$Component7);

	  function BlueMUI_CreateOptions(props) {
	    _classCallCheck(this, BlueMUI_CreateOptions);

	    var _this17 = _possibleConstructorReturn(this, (BlueMUI_CreateOptions.__proto__ || Object.getPrototypeOf(BlueMUI_CreateOptions)).call(this, props));

	    _this17.pages = 1;
	    // 默认state
	    _this17.state = {
	      subModule: _this17.props.subModule,
	      page: 1,
	      course_state: [1, 1, 1, 1, 1, 1]
	    };
	    _this17.change_course_state = _this17.change_course_state.bind(_this17);
	    _this17.allcheck = _this17.allcheck.bind(_this17);
	    return _this17;
	  }

	  // 单个复选框选中


	  _createClass(BlueMUI_CreateOptions, [{
	    key: 'change_course_state',
	    value: function change_course_state(eve) {
	      var bit = +eve.target.value;
	      var check = +this.refs['check-' + bit].checked;
	      var new_state = void 0;
	      if (this.refs.allchecked.checked) {
	        new_state = [0, 0, 0, 0, 0, 0];
	      } else {
	        new_state = this.state.course_state;
	      }
	      this.refs.allchecked.checked = false;
	      new_state.splice(bit, 1, check);
	      this.setState({
	        page: 1,
	        course_state: new_state
	      });
	    }
	  }, {
	    key: 'allcheck',
	    value: function allcheck(eve) {
	      if (eve.target.checked) {
	        for (var i = 0; i < 6; i++) {
	          this.refs['check-' + i].checked = false;
	        }
	        this.setState({
	          page: 1,
	          course_state: [1, 1, 1, 1, 1, 1]
	        });
	      } else {
	        this.setState({
	          page: 1,
	          course_state: [0, 0, 0, 0, 0, 0]
	        });
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var that = this;
	      var val = this.refs.serchValue ? this.refs.serchValue.value : '';
	      function hand_serch(eve) {
	        var searchValue = '';
	        if (document.getElementById('jxtdss')) {
	          searchValue = document.getElementById('jxtdss').value;
	        }
	        BlueMUI_GetList(that.state.subModule, 1, that.state.course_state, searchValue, that);
	      }
	      //查询列表
	      BlueMUI_GetList(this.state.subModule, this.state.page, this.state.course_state, val, this);
	      if (this.refs.serchValue) {
	        this.refs.serchValue.onkeydown = function (e) {
	          if (e.keyCode == 13) {
	            hand_serch();
	          }
	        };
	      }
	      if (this.state.subModule != 'audit' || this.state.subModule != 'kcfz') {
	        this.refs.allchecked.checked = true;
	      }
	      if (this.state.subModule === 'kcfz') {
	        return;
	      }
	      if (this.refs.serchBtn) {
	        this.refs.serchBtn.onclick = hand_serch;
	      }
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps, nextState) {
	      if (nextState.subModule === 'kcfz') {
	        return;
	      }
	      if (nextState.subModule != this.state.subModule) {
	        nextState.course_state = [1, 1, 1, 1, 1, 1];
	      }
	      if (this.refs.serchValue) {
	        BlueMUI_GetList(nextState.subModule, nextState.page, nextState.course_state, this.refs.serchValue.value, this);
	      } else {
	        BlueMUI_GetList(nextState.subModule, nextState.page, nextState.course_state, '', this);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var double_option = '';
	      if (this.state.subModule !== 'audit') {
	        double_option = _react2["default"].createElement(
	          'div',
	          null,
	          _react2["default"].createElement(
	            'div',
	            { id: 'out_serch' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u8BFE\u7A0B\u540D\u79F0\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'search-box' },
	              _react2["default"].createElement('input', { type: 'text', id: 'jxtdss', ref: 'serchValue' }),
	              _react2["default"].createElement(
	                'span',
	                { id: 'serch_btn', ref: 'serchBtn' },
	                '\u641C\u7D22'
	              )
	            )
	          )
	        );
	      } else {
	        double_option = '';
	      }
	      // label用作勾选框，中间不能填字
	      var filter_items = _react2["default"].createElement(
	        'ul',
	        { id: 'option_bar' },
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-5', value: '5', id: 'itm5', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm5' }),
	          '\u5DF2\u4E0A\u7EBF'
	        ),
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-4', value: '4', id: 'itm4', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm4' }),
	          '\u5DF2\u505C\u7528'
	        ),
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-3', value: '3', id: 'itm3', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm3' }),
	          '\u9A73\u56DE'
	        ),
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-2', value: '2', id: 'itm2', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm2' }),
	          '\u5F85\u5BA1\u6838'
	        ),
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-1', value: '1', id: 'itm1', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm1' }),
	          '\u7F16\u8F91\u4E2D'
	        ),
	        _react2["default"].createElement(
	          'li',
	          null,
	          _react2["default"].createElement('input', { type: 'checkbox', ref: 'check-0', value: '0', id: 'itm0', onChange: this.change_course_state }),
	          _react2["default"].createElement('label', { htmlFor: 'itm0' }),
	          '\u521D\u59CB'
	        )
	      );
	      var filter_allcheck = _react2["default"].createElement(
	        'span',
	        { id: 'option_allcheck' },
	        _react2["default"].createElement('input', { type: 'checkbox', value: '7', ref: 'allchecked', id: 'itm7', onChange: this.allcheck }),
	        _react2["default"].createElement('label', { htmlFor: 'itm7' }),
	        '\u6240\u6709\u8BFE\u7A0B'
	      );
	      var space_div = _react2["default"].createElement('div', { style: { width: '1px', height: '18px' } });

	      return _react2["default"].createElement(
	        'div',
	        { id: 'options' },
	        this.state.subModule == 'audit' || this.state.subModule == 'kcfz' ? '' : filter_items,
	        this.state.subModule == 'audit' || this.state.subModule == 'kcfz' ? space_div : filter_allcheck,
	        _react2["default"].createElement('div', { style: { clear: 'both' } }),
	        _react2["default"].createElement('div', { id: 'hr' }),
	        this.state.subModule === 'audit' ? '' : double_option
	      );
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      if (this.state.subModule == 'kcfz') {
	        _reactDom2["default"].unmountComponentAtNode(document.getElementById('React_list'));
	        BluMUI.result.CreateList = '';
	        _reactDom2["default"].unmountComponentAtNode(document.getElementById('React_fanye'));
	        Kcfzgl_option = _reactDom2["default"].render(_react2["default"].createElement(Option, null), document.getElementById('React_list'));
	        return;
	      }

	      var allchecked = this.state.course_state.reduce(function (x, y) {
	        return x + y;
	      });
	      if (!this.refs.allchecked) {
	        return;
	      }
	      if (allchecked == 0 || allchecked == 6) {
	        this.refs.allchecked.checked = true;
	        for (var i = 0; i < 6; i++) {
	          this.refs['check-' + i].checked = false;
	        }
	      } else {
	        this.refs.allchecked.checked = false;
	        for (var _i4 = 0; _i4 < 6; _i4++) {
	          this.refs['check-' + _i4].checked = this.state.course_state[_i4];
	        }
	      }
	    }
	  }]);

	  return BlueMUI_CreateOptions;
	}(_react2["default"].Component);

	var BlueMUI_GetList = function BlueMUI_GetList(Module, P, Cs, Serch, This) {
	  ajax({
	    url: courseCenter.host + 'getCourseList',
	    data: {
	      unifyCode: BluMUI.result.unifyCode,
	      courseState: '[' + Cs + ']',
	      page: P,
	      count: OUT_COUNT,
	      subModule: Module == 'history' ? 'maintenance' : Module,
	      selectName: Serch
	    },
	    success: function success(gets) {
	      var list = [];
	      var datas = JSON.parse(gets);
	      if (datas.meta.result != 100) {
	        list = [];
	      } else {
	        list = datas.data.courseList;
	      }
	      if (BluMUI.result.CreateList) {
	        BluMUI.result.CreateList.setState({
	          Lists: list,
	          Module: Module
	        });
	      } else {
	        BluMUI.create({
	          id: 'CreateList',
	          module: Module,
	          Lists: list
	        }, 'Create_list', document.getElementById('React_list'));
	      }
	      if (Module === 'audit') {
	        _reactDom2["default"].unmountComponentAtNode(document.getElementById('React_fanye'));
	        return;
	      }
	      _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreateFanye, { id: 'fanye', pages: datas.data.totalPages, page: P, This: This }), document.getElementById('React_fanye'));
	    }
	  });
	};

	//显示列表

	var BlueMUI_CreateList = function (_React$Component8) {
	  _inherits(BlueMUI_CreateList, _React$Component8);

	  function BlueMUI_CreateList(props) {
	    _classCallCheck(this, BlueMUI_CreateList);

	    var _this18 = _possibleConstructorReturn(this, (BlueMUI_CreateList.__proto__ || Object.getPrototypeOf(BlueMUI_CreateList)).call(this, props));

	    _this18.create_list = _this18.create_list.bind(_this18);
	    _this18.state = {
	      Lists: _this18.props.Lists,
	      Module: _this18.props.module
	    };
	    return _this18;
	  }

	  _createClass(BlueMUI_CreateList, [{
	    key: 'operation',
	    value: function operation(o, a, event) {
	      switch (o) {
	        case '提交/审核':
	          window.location.href = 'classManageCheck.html?classId=' + a + '&type=1';
	          break;
	        case '系部中心主任审核':
	          window.location.href = 'classManageCheck.html?classId=' + a + '&type=2';
	          break;
	        case '教学院长审核':
	          window.location.href = 'classManageCheck.html?classId=' + a + '&type=3';
	          break;
	        case '撤回':
	          Tijiao(3, a);
	          break;
	        case '停用':
	          Tijiao(4, a);
	          break;
	        case '启用':
	          Tijiao(5, a);
	          break;
	        case '编辑':
	          window.location.href = 'classManageEditor.html?classId=' + a;
	          break;
	        case '抽查':
	          window.location.href = 'classManageSpotCheck.html?classId=' + a + '&type=6';
	          break;
	        case '历史':
	          Show_lishi(a);
	          break;
	      }
	    }
	  }, {
	    key: 'create_list',
	    value: function create_list() {
	      var _this19 = this;

	      var op_func = void 0;
	      var op_able = void 0;
	      var list = [];
	      if (this.state.Lists.length == 0) {
	        return _react2["default"].createElement(
	          'tr',
	          { style: { background: 'transparent' } },
	          _react2["default"].createElement(
	            'td',
	            { id: 'ND' },
	            _react2["default"].createElement(
	              'div',
	              { className: 'no_data' },
	              _react2["default"].createElement('img', { width: '150px', height: '150px', src: '../../imgs/public/error.png' }),
	              _react2["default"].createElement('br', null),
	              _react2["default"].createElement(
	                'span',
	                null,
	                '\u6CA1\u6709\u6570\u636E'
	              )
	            )
	          )
	        );
	      }
	      this.state.Lists.map(function (e, index) {
	        var check = void 0;
	        var ops = [];
	        var lishi = _react2["default"].createElement(
	          'span',
	          { key: 'lish', onClick: _this19.operation.bind(_this19, '历史', e.kcbh), className: 'op_on' },
	          '\u5386\u53F2\u67E5\u8BE2'
	        );
	        var style = {
	          background: index % 2 ? '#eee' : '#fff'
	        };
	        e.cz.map(function (f, findex) {
	          op_func = f.able ? _this19.operation.bind(_this19, f.name, e.kcbh) : '';
	          ops.push(_react2["default"].createElement(
	            'span',
	            { key: findex, onClick: op_func, className: f.able ? 'op_on' : '' },
	            f.name
	          ));
	        });
	        ops.push(_react2["default"].createElement(
	          'span',
	          { key: 'lish', onClick: _this19.operation.bind(_this19, '历史', e.kcbh), className: 'op_on' },
	          '\u5386\u53F2\u67E5\u8BE2'
	        ));
	        list.push(_react2["default"].createElement(
	          'tr',
	          { key: index },
	          _react2["default"].createElement('td', null),
	          check,
	          _react2["default"].createElement(
	            'td',
	            null,
	            e.kcbh
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            _react2["default"].createElement(
	              'a',
	              { target: 'view_window', href: '../classInfShow/classInfReview.html?classId=' + e.kcbh },
	              e.kcmc
	            )
	          ),
	          _this19.state.Module == "query" || _this19.state.Module == "maintenance" ? _react2["default"].createElement(
	            'td',
	            null,
	            e.fzrxm
	          ) : null,
	          _react2["default"].createElement(
	            'td',
	            null,
	            e.jysmc
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            e.czsj || ''
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            e.dqzt
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            ops
	          ),
	          _react2["default"].createElement('td', null)
	        ));
	      });
	      return list;
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      if (BluMUI.result.Tab.state.subModule !== 'audit') {
	        Array().map.call(document.getElementById('center_table').getElementsByTagName('input'), function (e) {
	          e.checked = false;
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.state.Module == "query" || this.state.Module == "maintenance") {
	        return _react2["default"].createElement(
	          'table',
	          { id: 'center_table' },
	          _react2["default"].createElement(
	            'thead',
	            null,
	            _react2["default"].createElement(
	              'tr',
	              null,
	              _react2["default"].createElement('td', { width: '20px' }),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                '\u8BFE\u7A0B\u7F16\u53F7'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '20%' },
	                '\u8BFE\u7A0B\u540D\u79F0'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '6%' },
	                '\u8BFE\u7A0B\u8D1F\u8D23\u4EBA'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '20%' },
	                '\u6559\u5B66\u673A\u6784\u540D\u79F0'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '14%' },
	                '\u6700\u8FD1\u66F4\u65B0\u65F6\u95F4'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '13%' },
	                '\u8BFE\u7A0B\u72B6\u6001'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                '\u64CD\u4F5C'
	              ),
	              _react2["default"].createElement('td', { width: '20px' })
	            )
	          ),
	          _react2["default"].createElement(
	            'tbody',
	            { ref: 'list_body' },
	            this.create_list()
	          )
	        );
	      } else {
	        return _react2["default"].createElement('iframe', { style: { display: 'block' }, src: '../classManage/classManageCheck.html', frameBorder: '0' });
	      }
	    }
	  }]);

	  return BlueMUI_CreateList;
	}(_react2["default"].Component);

	/*显示历史*/


	function Show_lishi(course_id) {
	  _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreatePopup, { Course: course_id }), document.getElementById('popup'));
	}

	//创建弹出层层(历史)

	var BlueMUI_CreatePopup = function (_React$Component9) {
	  _inherits(BlueMUI_CreatePopup, _React$Component9);

	  function BlueMUI_CreatePopup(props) {
	    _classCallCheck(this, BlueMUI_CreatePopup);

	    var _this20 = _possibleConstructorReturn(this, (BlueMUI_CreatePopup.__proto__ || Object.getPrototypeOf(BlueMUI_CreatePopup)).call(this, props));

	    _this20.state = {
	      lists: [],
	      page: 1,
	      pages: 0
	    };
	    _this20.popup = document.getElementById('popup');
	    return _this20;
	  }

	  _createClass(BlueMUI_CreatePopup, [{
	    key: 'create_popup_top',
	    value: function create_popup_top() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'top' },
	        _react2["default"].createElement(
	          'span',
	          null,
	          '\u5386\u53F2\u4FE1\u606F'
	        ),
	        _react2["default"].createElement(
	          'span',
	          { id: 'popup_close', ref: 'close' },
	          _react2["default"].createElement('img', { src: '../../imgs/classListInfShow/close.png', alt: 'close' })
	        )
	      );
	    }
	  }, {
	    key: 'create_popup_thead',
	    value: function create_popup_thead() {
	      return _react2["default"].createElement(
	        'thead',
	        null,
	        _react2["default"].createElement(
	          'tr',
	          null,
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u64CD\u4F5C'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u64CD\u4F5C\u540E\u72B6\u6001  '
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '15%' },
	            '\u64CD\u4F5C\u65F6\u95F4'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '10%' },
	            '\u64CD\u4F5C\u4EBA\u59D3\u540D'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '' },
	            '\u5907\u6CE8'
	          )
	        )
	      );
	    }
	  }, {
	    key: 'create_popup_tbody',
	    value: function create_popup_tbody() {
	      return _react2["default"].createElement(
	        'tbody',
	        { ref: 'popup_tbody' },
	        this.state.lists.map(function (e, index) {
	          return _react2["default"].createElement(
	            'tr',
	            { key: index },
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.cz
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.czhzt
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.czsj
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.czrxm
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              e.bz.replace(/\\n/g, '\n')
	            )
	          );
	        })
	      );
	    }
	  }, {
	    key: 'del_popup',
	    value: function del_popup() {
	      _reactDom2["default"].unmountComponentAtNode(this.popup);
	      this.popup.style.display = 'none';
	    }
	  }, {
	    key: 'get_lists',
	    value: function get_lists() {
	      var _this21 = this;

	      /* 获取数据 */
	      ajax({
	        url: courseCenter.host + 'getOperationList',
	        data: {
	          unifyCode: BluMUI.result.unifyCode,
	          courseNo: this.props.Course,
	          page: this.state.page,
	          count: 11
	        },
	        success: function success(e) {
	          var datas = JSON.parse(e);
	          _this21.setState({
	            lists: datas.data.operationList,
	            pages: datas.data.totalPages
	          });
	        }
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(preProps, preState) {
	      if (preState.page != this.state.page) {
	        this.get_lists();
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      document.getElementById('popup_body').onclick = function (e) {};
	      this.refs.close.onclick = this.del_popup.bind(this);
	      this.get_lists();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.popup.style.display = "block";
	      return _react2["default"].createElement(
	        'div',
	        { className: 'pop-wrap' },
	        _react2["default"].createElement(
	          'div',
	          { id: 'popup_body' },
	          this.create_popup_top(),
	          _react2["default"].createElement(
	            'table',
	            { id: 'serch_table' },
	            this.create_popup_thead(),
	            this.create_popup_tbody()
	          ),
	          _react2["default"].createElement(BlueMUI_CreateFanye, { id: 'lishi_fanye', page: this.state.page, pages: this.state.pages, This: this, ref: 'fanye_in' })
	        )
	      );
	    }
	  }]);

	  return BlueMUI_CreatePopup;
	}(_react2["default"].Component);

	// 提交审核的弹出

	var Tijiaoshenhe = function (_React$Component10) {
	  _inherits(Tijiaoshenhe, _React$Component10);

	  function Tijiaoshenhe(props) {
	    _classCallCheck(this, Tijiaoshenhe);

	    return _possibleConstructorReturn(this, (Tijiaoshenhe.__proto__ || Object.getPrototypeOf(Tijiaoshenhe)).call(this, props));
	  }

	  _createClass(Tijiaoshenhe, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this23 = this;

	      this.refs.tijiao.onclick = function (e) {
	        Tijiao(1, _this23.props.Kcbh);
	        _this23.die();
	      };
	      this.refs.fanhui.onclick = this.die;
	      this.refs.close.onclick = this.die;
	    }
	  }, {
	    key: 'die',
	    value: function die() {
	      document.getElementById('tijiaoshenhe').style.display = 'none';
	      _reactDom2["default"].unmountComponentAtNode(document.getElementById('tijiaoshenhe'));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'div',
	        null,
	        _react2["default"].createElement(
	          'div',
	          { id: 'tijiaoshenhe_head' },
	          _react2["default"].createElement(
	            'span',
	            null,
	            '\u63D0\u4EA4\u5BA1\u6838'
	          ),
	          _react2["default"].createElement('img', { ref: 'close', src: '../../imgs/courseAudit/close.png' })
	        ),
	        _react2["default"].createElement(
	          'p',
	          null,
	          '\u6750\u6599\u5C06\u63D0\u4EA4\u81F3\u6559\u5B66\u9662\u957F\u3001\u7CFB\u90E8\u4E2D\u5FC3\u4E3B\u4EFB\u3001',
	          _react2["default"].createElement('br', null),
	          '\u8BFE\u7A0B\u8D1F\u8D23\u4EBA\u8FDB\u884C\u5BA1\u6838\uFF0C\u63D0\u4EA4\u540E\u4E0D\u53EF\u4FEE\u6539\u3002'
	        ),
	        _react2["default"].createElement(
	          'div',
	          { id: 'tijiao_div' },
	          _react2["default"].createElement(
	            'span',
	            { className: 'tijiao', ref: 'tijiao' },
	            '\u786E\u5B9A'
	          ),
	          _react2["default"].createElement(
	            'span',
	            { className: 'fanhui', ref: 'fanhui' },
	            '\u8FD4\u56DE'
	          )
	        )
	      );
	    }
	  }]);

	  return Tijiaoshenhe;
	}(_react2["default"].Component);

	function Tjsh(kcbh) {
	  var t = document.getElementById('tijiaoshenhe');
	  t.style.display = "block";
	  _reactDom2["default"].render(_react2["default"].createElement(Tijiaoshenhe, { Kcbh: kcbh }), t);
	}

	function Tijiao(op, course, note) {
	  ajax({
	    url: courseCenter.host + 'submitOperation',
	    data: {
	      unifyCode: BluMUI.result.unifyCode,
	      courseNo: course,
	      note: note || '',
	      type: op
	    },
	    success: function success(gets) {
	      var datas = JSON.parse(gets);
	      BluMUI.result.Tab.change_subModule(BluMUI.result.Tab.state.subModule);
	      // BlueMUI_GetList(
	      //   BluMUI.result.Tab.state.subModule,
	      //   BluMUI.result.Options.state.page,
	      //   BluMUI.result.Options.state.course_state
	      // );
	    }
	  });
	}

	var BluMUI_M = {
	  Create_options: BlueMUI_CreateOptions,
	  Create_tabs: BlueMUI_CreateTabs,
	  Create_list: BlueMUI_CreateList
	};

	var BluMUI = {
	  result: {},
	  create: function create(data, type, elem) {
	    var props = data,
	        Blu = BluMUI_M[type];
	    this.result[props.id] = _reactDom2["default"].render(_react2["default"].createElement(Blu, props), elem);
	  }
	};
	BluMUI.result.Get_list = BlueMUI_GetList;

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