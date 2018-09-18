webpackJsonp([8],{

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
	var _COUNT = 10;

	var SET = function SET(key, value) {
	  sessionStorage.setItem("wpgl-jieguo-" + key, value);
	  return value;
	};

	var GET = function GET(key) {
	  return sessionStorage.getItem("wpgl-jieguo-" + key) || '';
	};

	var WPPCS = [];

	var Option = function (_React$Component) {
	  _inherits(Option, _React$Component);

	  function Option(props) {
	    _classCallCheck(this, Option);

	    var _this = _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).call(this, props));

	    _this.model = GET("model") || "zj";
	    _this.search_cache = {
	      byzj: Boolean(+GET("byzj")) === Boolean(+GET("bykc")) ? true : Boolean(+GET("byzj")),
	      bykc: Boolean(+GET("bykc")) || false,
	      yfp: Boolean(+GET("yfp")),
	      wfp: Boolean(+GET("wfp")),
	      fzx: GET("fzx"),
	      name: GET("name")
	    };
	    _this.state = {
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      },
	      list: [],

	      byzj: _this.search_cache.byzj,
	      bykc: _this.search_cache.bykc,
	      yfp: _this.search_cache.yfp,
	      wfp: _this.search_cache.wfp,
	      fzx: _this.search_cache.fzx,
	      name: _this.search_cache.name,
	      fzx_select: [],
	      zjxm_input: ""
	    };
	    return _this;
	  }

	  _createClass(Option, [{
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this2 = this;

	      var page = p || +GET("page") || 1;

	      ajax({
	        url: courseCenter.host + "reviewAllocateResult",
	        data: {
	          unifyCode: getCookie("userId"),
	          ID: parseHash(window.location.href).id,
	          page: page,
	          count: _COUNT,
	          type: ['zj', 'kc'].indexOf(this.model) + 1,
	          allocateStatus: '[' + +this.yfp.checked + ',' + +this.wfp.checked + ']',
	          selectItem: this.search_cache.fzx,
	          selectName: SET('name', this.name_input.value)
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
	            list: datas.data.allocateList
	          });
	        }
	      });
	    }
	  }, {
	    key: 'change_fzx',
	    value: function change_fzx(e) {
	      this.setState({
	        fzx: e ? e.target.value : this.state.fzx
	      });
	      this.search_cache.fzx = SET('fzx', e ? e.target.value : this.state.fzx);
	      this._get_list(1);
	    }
	  }, {
	    key: 'search',
	    value: function search() {
	      this.search_cache.wppc = SET("yfp", this.yfp.checked);
	      this.search_cache.wfp = SET("wfp", this.wfp.checked);
	      this.search_cache.fzx = SET("fzx", this.state.fzx);
	      this.search_cache.zjxm = SET("zjxm", this.state.zjxm);
	      this._get_list(1);
	    }
	  }, {
	    key: 'model_change',
	    value: function model_change(model, eve) {
	      // limit request of check way
	      if (['kc', 'zj'].indexOf(model) === -1 || eve.target.checked === this.state['by' + model]) {
	        return;
	      }
	      this.model = SET("model", model);
	      this.search_cache.byzj = Boolean(+SET("byzj", +(model === 'zj')));
	      this.search_cache.bykc = Boolean(+SET("bykc", +(model === 'kc')));
	      this.setState({
	        fzx: '',
	        list: [],
	        byzj: this.search_cache.byzj,
	        bykc: this.search_cache.bykc
	      });
	      this.name_input.value = '';
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
	            { id: 'up' },
	            _react2["default"].createElement(
	              'button',
	              { className: 'big_btn', ref: function ref(btn) {
	                  return _this3.back = btn;
	                } },
	              '\u8FD4\u56DE'
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'mid' },
	            _react2["default"].createElement('input', {
	              name: 'check_way',
	              type: 'radio',
	              id: 'byzj',
	              defaultChecked: this.state.byzj,
	              onChange: this.model_change.bind(this, 'zj'),
	              ref: function ref(check) {
	                return _this3.byzj = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'byzj' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u6309\u4E13\u5BB6\u67E5\u770B'
	            ),
	            _react2["default"].createElement('input', {
	              name: 'check_way',
	              type: 'radio',
	              id: 'bykc',
	              defaultChecked: this.state.bykc,
	              onChange: this.model_change.bind(this, 'kc'),
	              ref: function ref(check) {
	                return _this3.bykc = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'bykc' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u6309\u8BFE\u7A0B\u67E5\u770B'
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'down' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              (this.state.byzj ? '专家' : '课程') + '\u5206\u914D' + (this.state.byzj ? '课程' : '专家') + '\u72B6\u6001\uFF1A'
	            ),
	            _react2["default"].createElement('input', {
	              type: 'checkbox',
	              id: 'yfp',
	              ref: function ref(check) {
	                return _this3.yfp = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'yfp' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u5DF2\u5206\u914D'
	            ),
	            _react2["default"].createElement('input', {
	              type: 'checkbox',
	              id: 'wfp',
	              ref: function ref(check) {
	                return _this3.wfp = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'wfp' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u672A\u5206\u914D'
	            ),
	            _react2["default"].createElement(
	              'span',
	              { id: 'wppc' },
	              (this.state.byzj ? '专家' : '课程') + '\u5206\u7EC4\u9879\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'select',
	              {
	                name: 'wppc_select',
	                id: 'wppc_select',
	                ref: function ref(sel) {
	                  return _this3.wppc_select = sel;
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
	            ),
	            _react2["default"].createElement(
	              'span',
	              { id: 'wppc' },
	              (this.state.byzj ? '专家姓名' : '课程名') + '\uFF1A'
	            ),
	            _react2["default"].createElement('input', {
	              name: 'zjxm_input',
	              id: 'zjxm_input',
	              ref: function ref(input) {
	                return _this3.name_input = input;
	              },
	              defaultValue: this.state.name
	            }),
	            _react2["default"].createElement(
	              'button',
	              { id: 'serch', onClick: this.search.bind(this) },
	              '\u641C\u7D22'
	            )
	          )
	        ),
	        _react2["default"].createElement(Lists, { ref: 'list', Lists: this.state.list, model: this.model }),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this3._get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this4 = this;

	      // 填充分组项次下拉菜单
	      ajax({
	        url: courseCenter.host + "getFzxByWppc",
	        data: {
	          unifyCode: getCookie("userId"),
	          reviewBatch: parseHash(window.location.href).wppc
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result !== 100) {
	            alert("下拉菜单获取失败！");
	            return;
	          }
	          _this4.setState({
	            fzx_select: JSON.parse(gets).data
	          });
	        }
	      });

	      // 首次查询列表并填充
	      this._get_list(1);

	      this.yfp.onchange = this._get_list.bind(this, 1);
	      this.wfp.onchange = this._get_list.bind(this, 1);

	      // back button click options
	      this.back.onclick = function () {
	        // clear tab sessionStorage
	        var delet_tag_prefix = new RegExp('^wpgl-jieguo-');
	        for (var end = window.sessionStorage.length; end > 0; end--) {
	          if (delet_tag_prefix.test(window.sessionStorage.key(end - 1))) {
	            sessionStorage.removeItem(window.sessionStorage.key(end - 1));
	          }
	        }
	        window.location.href = 'wpgl.html';
	      };
	    }
	  }]);

	  return Option;
	}(_react2["default"].Component);

	var Lists = function (_React$Component2) {
	  _inherits(Lists, _React$Component2);

	  function Lists(props) {
	    _classCallCheck(this, Lists);

	    return _possibleConstructorReturn(this, (Lists.__proto__ || Object.getPrototypeOf(Lists)).call(this, props));
	  }

	  _createClass(Lists, [{
	    key: 'create_head',
	    value: function create_head() {
	      switch (this.props.model) {
	        case 'zj':
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
	                { width: '10%' },
	                '\u4E13\u5BB6\u59D3\u540D'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '15%' },
	                '\u6240\u5C5E\u4E13\u5BB6\u5206\u7EC4\u9879'
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                '\u5DF2\u5206\u914D\u8BFE\u7A0B'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '8%' },
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
	          break;

	        case 'kc':
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
	              _react2["default"].createElement('td', { width: '20px', className: 'td_left_space' }),
	              _react2["default"].createElement(
	                'td',
	                null,
	                '\u8BFE\u7A0B\u540D\u79F0'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                '\u8BFE\u7A0B\u7F16\u53F7'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '15%' },
	                '\u6240\u5C5E\u8BFE\u7A0B\u5206\u7EC4\u9879'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '45%' },
	                '\u5DF2\u5206\u914D\u4E13\u5BB6'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '8%' },
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
	          break;
	        default:
	          return _react2["default"].createElement('thead', null);
	      }
	    }
	  }, {
	    key: 'option',
	    value: function option(type, id, wpid, groupItem, itemName, courseId, eve) {
	      // eve.preventDefault();

	      switch (type) {
	        case 'show':
	          Creat_popup('show', groupItem, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'edit':
	          if (this.props.model === 'zj') {
	            window.location.href = './masterWPEditorBymaster.html?wpID=' + wpid + '&expId=' + id + '&masterId=' + id + '&masterName=' + itemName + '&groupItem=' + groupItem + '&wppc=' + parseHash(window.location.href).wppc;
	          } else {
	            window.location.href = './masterWPEditor.html?courseNo=' + courseId + '&wpID=' + wpid + '&expId=' + id + '&masterId=' + id + '&masterName=' + itemName + '&groupItem=' + groupItem + '&wppc=' + parseHash(window.location.href).wppc;
	          }
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'create_body',
	    value: function create_body() {
	      var _this6 = this;

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

	      switch (this.props.model) {
	        case 'zj':
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
	                  e.itemName
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.groupItem
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement(
	                    'span',
	                    { className: 'num' },
	                    '[' + e.count + ']'
	                  ),
	                  _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this6.option.bind(_this6, "show", e.itemID, e.wpid, e.groupItem, e.itemName) },
	                    e.count < 4 ? e.list.map(function (m, index) {
	                      return _react2["default"].createElement(
	                        'span',
	                        { key: index },
	                        m.name
	                      );
	                    }) : e.list.map(function (m, index) {
	                      return index < 3 && _react2["default"].createElement(
	                        'span',
	                        { key: index },
	                        m.name
	                      );
	                    }).concat(_react2["default"].createElement(
	                      'span',
	                      { key: 'dot' },
	                      '\u2026\u2026'
	                    ))
	                  )
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.ableModify ? _react2["default"].createElement(
	                    'div',
	                    null,
	                    _react2["default"].createElement(
	                      'span',
	                      { className: 'green_btn', onClick: _this6.option.bind(_this6, "edit", e.itemID, e.wpid, e.groupItem, e.itemName) },
	                      '\u4FEE\u6539'
	                    )
	                  ) : ''
	                ),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement('td', { className: 'td_end' })
	              );
	            })
	          );
	          break;

	        case 'kc':
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
	                  e.itemName
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.itemID
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.groupItem
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement(
	                    'span',
	                    { className: 'num' },
	                    '[' + e.count + ']'
	                  ),
	                  _react2["default"].createElement(
	                    'span',
	                    null,
	                    e.count < 6 ? e.list.map(function (m, index) {
	                      return _react2["default"].createElement(
	                        'span',
	                        { key: index },
	                        m.name
	                      );
	                    }) : e.list.map(function (m, index) {
	                      return index < 5 && _react2["default"].createElement(
	                        'span',
	                        { key: index },
	                        m.name
	                      );
	                    }).concat(_react2["default"].createElement(
	                      'span',
	                      { key: 'dot' },
	                      '\u2026\u2026'
	                    ))
	                  )
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.ableModify ? _react2["default"].createElement(
	                    'div',
	                    null,
	                    _react2["default"].createElement(
	                      'span',
	                      { className: 'green_btn', onClick: _this6.option.bind(_this6, "edit", e.itemID, e.wpid, e.groupItem, e.itemName, e.itemID) },
	                      '\u4FEE\u6539'
	                    )
	                  ) : ''
	                ),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement('td', { className: 'td_end' })
	              );
	            })
	          );
	          break;
	        default:
	          return _react2["default"].createElement('tbody', null);
	          break;
	      }
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
	    value: function componentDidMount() {}
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      if (window.frameElement) {
	        window.frameElement.height = document.body.scrollHeight;
	      }
	    }
	  }]);

	  return Lists;
	}(_react2["default"].Component);

	var Poplist = function (_React$Component3) {
	  _inherits(Poplist, _React$Component3);

	  function Poplist(props) {
	    _classCallCheck(this, Poplist);

	    var _this7 = _possibleConstructorReturn(this, (Poplist.__proto__ || Object.getPrototypeOf(Poplist)).call(this, props));

	    _this7.state = {
	      list: [],
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      }
	    };
	    return _this7;
	  }

	  _createClass(Poplist, [{
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this8 = this;

	      ajax({
	        url: courseCenter.host + 'queryExpAllocDetail',
	        data: {
	          unifyCode: getCookie("userId"),
	          ID: parseHash(window.location.href).id,
	          expID: this.props.id,
	          groupItem: this.props.fzx,
	          page: p || 1,
	          count: _COUNT
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result !== 100) {
	            return;
	          }
	          _this8.setState({
	            list: datas.data.list,
	            TP: {
	              page: p || 1,
	              pages: datas.data.totalPages,
	              total: datas.data.total
	            }
	          });
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this9 = this;

	      return _react2["default"].createElement(
	        'div',
	        null,
	        _react2["default"].createElement(
	          'div',
	          { id: 'pop_table_body' },
	          _react2["default"].createElement(
	            'table',
	            null,
	            _react2["default"].createElement(
	              'thead',
	              null,
	              _react2["default"].createElement(
	                'tr',
	                null,
	                _react2["default"].createElement(
	                  'td',
	                  { width: '44%' },
	                  '\u8BFE\u7A0B\u540D\u79F0'
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  { width: '28%' },
	                  '\u8BFE\u7A0B\u7F16\u53F7'
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  { width: '28%' },
	                  '\u5F00\u8BFE\u5B66\u9662'
	                )
	              )
	            ),
	            _react2["default"].createElement(
	              'tbody',
	              null,
	              this.state.list.map(function (e, index) {
	                return _react2["default"].createElement(
	                  'tr',
	                  { key: index },
	                  _react2["default"].createElement(
	                    'td',
	                    null,
	                    e.courseName
	                  ),
	                  _react2["default"].createElement(
	                    'td',
	                    null,
	                    e.courseNo
	                  ),
	                  _react2["default"].createElement(
	                    'td',
	                    null,
	                    e.unit
	                  )
	                );
	              })
	            )
	          )
	        ),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this9._get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._get_list(1);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var bgh = document.getElementById('background').scrollHeight;
	      if (window.frameElement) {
	        var H = document.body.offsetHeight;
	        if (bgh > parseInt(document.body.offsetHeight)) {
	          H = bgh;
	        }
	        window.frameElement.height = H;
	      }
	    }
	  }]);

	  return Poplist;
	}(_react2["default"].Component);

	var Popup = function (_React$Component4) {
	  _inherits(Popup, _React$Component4);

	  function Popup(props) {
	    _classCallCheck(this, Popup);

	    return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));
	  }

	  _createClass(Popup, [{
	    key: 'delete_popup',
	    value: function delete_popup(e) {
	      if (e.target === this.background) {
	        _reactDom2["default"].unmountComponentAtNode(e.target.parentNode);
	      }
	    }
	  }, {
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
	        case 'show':
	          return _react2["default"].createElement(
	            'div',
	            {
	              id: 'background',
	              ref: function ref(div) {
	                return _this11.background = div;
	              },
	              onClick: function onClick(e) {
	                return _this11.delete_popup(e);
	              }
	            },
	            _react2["default"].createElement(
	              'div',
	              { id: 'poplist', ref: 'pb', onClick: function onClick(e) {
	                  return e.stopPropagation;
	                } },
	              _react2["default"].createElement(Poplist, { id: this.props.id, fzx: this.props.names })
	            )
	          );
	        default:
	          return _react2["default"].createElement(
	            'div',
	            null,
	            'error'
	          );
	          break;
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _props2 = this.props,
	          id = _props2.id,
	          type = _props2.type;

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
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (window.frameElement) {
	        window.frameElement.height = document.body.offsetHeight;
	      }
	    }
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