webpackJsonp([7],{

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
	var _POPCOUNT = 5;

	var SET = function SET(key, value) {
	  sessionStorage.setItem("wpgl-fenpei-" + key, value);
	  return value;
	};

	var GET = function GET(key) {
	  return sessionStorage.getItem("wpgl-fenpei-" + key) || '';
	};

	var WPPCS = [];
	// 每组输入的数据
	var Nums = [];
	// 每组输入数据的缓存
	var NumsCache = [];
	// 每一条分组的分组数量
	var FenzuNum = new Array(10).fill(0);
	// 每一条分组的专家数量
	var ZhuanjiaNum = new Array(10).fill(0);
	// 选中的条目
	var Checks = [];
	// 每条信息条目
	var Items = new Array(10).fill('');

	var Option = function (_React$Component) {
	  _inherits(Option, _React$Component);

	  function Option(props) {
	    _classCallCheck(this, Option);

	    var _this = _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).call(this, props));

	    _this.search_cache = {
	      fzx: GET("fzx"),
	      yfp: GET("yfp") || SET("yfp", 1),
	      wfp: GET("wfp") || SET("wfp", 1)
	    };
	    _this.title = parseHash(window.location.href)['wppc'];
	    _this.state = {
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      },
	      list: [],
	      dangerHTML: ''
	    };
	    return _this;
	  }

	  _createClass(Option, [{
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this2 = this;

	      var page = p || +GET("page") || 1;

	      ajax({
	        url: courseCenter.host + "reviewAlloc",
	        data: {
	          unifyCode: getCookie("userId"),
	          ID: parseHash(window.location.href).id,
	          page: page,
	          count: _COUNT,
	          groupItem: this.search_cache.fzx,
	          assignState: '[' + +this.search_cache.yfp + ', ' + +this.search_cache.wfp + ']'
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
	    key: 'search',
	    value: function search() {
	      // this.search_cache.zjxm=SET("zjxm",this.state.zjxm);
	      this._get_list(1);
	    }
	  }, {
	    key: 'create_fzx_select',
	    value: function create_fzx_select() {
	      var _this3 = this;

	      var change_fzx = function change_fzx(eve) {
	        _this3.search_cache.fzx = SET('fzx', eve.target.value);
	        _this3._get_list(1);
	      };
	      return _react2["default"].createElement('select', {
	        name: 'fzx',
	        id: 'fenpei-fzx',
	        ref: function ref(sel) {
	          return _this3.fzx_select = sel;
	        },
	        defaultValue: this.search_cache.fzx,
	        onChange: change_fzx
	        // dangerouslySetInnerHTML = {this.state.dangerHTML}
	      });
	    }
	  }, {
	    key: 'change_state',
	    value: function change_state(state, eve) {
	      this.search_cache[state] = SET(state, +eve.target.checked);
	      this.search();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

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
	                  return _this4.back = btn;
	                } },
	              '\u8FD4\u56DE'
	            ),
	            _react2["default"].createElement(
	              'p',
	              null,
	              '\u7F51\u8BC4\u6279\u6B21\u540D\u79F0\uFF1A',
	              this.title
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'mid' },
	            _react2["default"].createElement(
	              'div',
	              { id: 'big3' },
	              _react2["default"].createElement(
	                'button',
	                { className: 'big_btn', ref: function ref(btn) {
	                    return _this4.PLcx = btn;
	                  } },
	                '\u6279\u91CF\u64A4\u9500'
	              ),
	              _react2["default"].createElement(
	                'button',
	                { className: 'big_btn', ref: function ref(btn) {
	                    return _this4.PLfp = btn;
	                  } },
	                '\u6279\u91CF\u5206\u914D'
	              ),
	              _react2["default"].createElement(
	                'button',
	                { className: 'big_btn', ref: function ref(btn) {
	                    return _this4.fpjg = btn;
	                  } },
	                '\u5206\u914D\u7ED3\u679C'
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'state' },
	              _react2["default"].createElement(
	                'span',
	                { id: 'zj_state' },
	                '\u4E13\u5BB6\u8BFE\u7A0B\u5206\u914D\u72B6\u6001\uFF1A'
	              ),
	              _react2["default"].createElement('input', {
	                type: 'checkbox',
	                id: 'yfp',
	                defaultChecked: +this.search_cache.yfp,
	                onChange: this.change_state.bind(this, 'yfp'),
	                ref: function ref(check) {
	                  return _this4.yfp = check;
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
	                defaultChecked: +this.search_cache.wfp,
	                onChange: this.change_state.bind(this, 'wfp'),
	                ref: function ref(check) {
	                  return _this4.wfp = check;
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
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'searchs' },
	              _react2["default"].createElement(
	                'span',
	                { id: 'fzx' },
	                '\u5206\u7EC4\u9879\uFF1A'
	              ),
	              this.create_fzx_select()
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'down' },
	            _react2["default"].createElement(
	              'div',
	              null,
	              _react2["default"].createElement(
	                'span',
	                null,
	                '\u6CE8\uFF1A'
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              null,
	              _react2["default"].createElement(
	                'p',
	                null,
	                '\u5206\u7EC4\u6570\u91CF\u51B3\u5B9A\u4E13\u5BB6\u8BC4\u4EF7\u7684\u8BFE\u7A0B\u6570\u548C\u8BFE\u7A0B\u8BC4\u4EF7\u7684\u4E13\u5BB6\u6570\u3002'
	              ),
	              _react2["default"].createElement(
	                'p',
	                null,
	                '\u5982\u4E13\u5BB615\u4EBA\uFF0C\u8BFE\u7A0B\u657030\u95E8\uFF0C\u5206\u7EC4\u6570\u91CF5\uFF0C\u5219\u6BCF\u4E2A\u4E13\u5BB6\u8BC4\u4EF7\u7684\u8BFE\u7A0B\u6570=30/5=6\uFF0C\u6BCF\u95E8\u8BFE\u7A0B\u8BC4\u4EF7\u7684\u4E13\u5BB6\u6570=15/5=3\u3002'
	              )
	            )
	          )
	        ),
	        _react2["default"].createElement(Lists, { ref: 'list', Lists: this.state.list, model: this.model }),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this4._get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this5 = this;

	      var ops = '<option value="">\u8BF7\u9009\u62E9</option>';
	      this.fzx_select.innerHTML = ops;
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

	          var nowItem = _this5.search_cache.fzx;
	          JSON.parse(gets).data.forEach(function (e, index) {
	            return ops += '<option data-reactid=".0.0.1.2.1.' + index + '" ' + (e.fzx === nowItem ? 'selected' : null) + ' value=' + e.fzx + '>' + e.fzx + '</option>';
	          });
	          _this5.fzx_select.innerHTML = ops.toString();
	          // this.setState({dangerHTML: ops});
	        }
	      });

	      // 首次查询列表并填充
	      this._get_list(1);

	      // back button click options
	      this.back.onclick = function () {
	        // clear tab sessionStorage
	        var delet_tag_prefix = new RegExp('^wpgl-fenpei-');
	        for (var end = window.sessionStorage.length; end > 0; end--) {
	          if (delet_tag_prefix.test(window.sessionStorage.key(end - 1))) {
	            sessionStorage.removeItem(window.sessionStorage.key(end - 1));
	          }
	        }
	        window.location.href = 'wpgl.html';
	      };

	      this.PLcx.onclick = function () {
	        var flag = false;
	        // 检查数据是否都合法？state=1
	        flag = Items.some(function (e) {
	          return e && e.state !== 1;
	        });
	        if (!flag && Items.every(function (e) {
	          return e === '';
	        })) {
	          alert('请先选择需要撤销的项！');
	          return;
	        }
	        if (flag) {
	          alert('只能撤销已分配的项目，请检查！');
	          return;
	        }
	        // 经过筛选后合法的数据
	        var exGroups = [];
	        Items.forEach(function (e) {
	          return e && exGroups.push(e.groupItem);
	        });
	        Creat_popup('批量撤销', Nums.toString(), 'useless', exGroups.join(','));
	        document.getElementById('popup').style.display = "block";
	      };
	      this.PLfp.onclick = function () {
	        var flag = false;
	        // 检查数据是否都合法？state!=1
	        flag = Items.some(function (e) {
	          return e && e.state === 1;
	        });
	        if (!flag && Items.every(function (e) {
	          return e === '';
	        })) {
	          alert('请先选择需要分配的项！');
	          return;
	        }
	        if (flag) {
	          alert('只能分配未分配的项目，请检查！');
	          return;
	        }
	        // 经过筛选后合法的数据
	        var exGroups = [];
	        Items.forEach(function (e) {
	          return e && exGroups.push(e.expertGroup);
	        });
	        Creat_popup('批量分配', Nums.toString(), _this5.refs.list.lists.toString());
	        document.getElementById('popup').style.display = "block";
	      };
	      // 分配结果跳转
	      this.fpjg.onclick = function () {
	        window.location.href = './wpgl-jieguo.html?wppc=' + parseHash(window.location.href).wppc + '&id=' + parseHash(window.location.href).id;
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

	    _this6.lists = [];
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
	          _react2["default"].createElement('td', { width: '20px', className: 'td_left_space' }),
	          _react2["default"].createElement(
	            'td',
	            { width: '10px' },
	            _react2["default"].createElement('input', {
	              type: 'checkbox',
	              id: 'allCheck',
	              ref: function ref(check) {
	                return _this7.allCheck = check;
	              }
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'allCheck' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            )
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '22%' },
	            '\u4E13\u5BB6\u5206\u7EC4\u9879'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '22%' },
	            '\u8BFE\u7A0B\u5206\u7EC4\u9879'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '15%' },
	            '\u5206\u7EC4\u6570\u91CF'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '15%' },
	            '\u72B6\u6001'
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
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
	    value: function option(type, id, num, groupItem, index) {
	      switch (type) {
	        case '撤销':
	          Creat_popup('撤销', num, id, groupItem, index);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case '自动分配':
	          Creat_popup('自动分配', num, id, groupItem, index);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'showZJ':
	          Creat_popup('showZJ', num, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'showKC':
	          Creat_popup('showKC', num, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'check',
	    value: function check(id, num, list, index, eve) {
	      if (eve.target.checked) {
	        this.lists.push(id);
	        Nums.push(num || 0);
	        Checks.push(index);
	        Items[index] = list;
	      } else {
	        this.lists = this.lists.filter(function (e) {
	          return e !== id;
	        });
	        Nums = Nums.filter(function (e) {
	          return e !== num;
	        });
	        Checks = Checks.filter(function (e) {
	          return e !== index;
	        });
	        Items[index] = '';
	      }
	      this.allCheck.checked = false;
	    }

	    // 输入数字检测

	  }, {
	    key: 'input_num',
	    value: function input_num(index, eve) {
	      if (/^\d*$/.test(eve.target.value)) {
	        FenzuNum[index] = +eve.target.value;
	      } else {
	        eve.target.value = 0;
	        return;
	      }
	    }
	    // 离开输入框检测

	  }, {
	    key: 'num_input_blur',
	    value: function num_input_blur(index, eve) {
	      if (eve.target.value === '') {
	        eve.target.value = 0;
	        FenzuNum[index] = 0;
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
	        this.props.Lists.map(function (list, index) {
	          return _react2["default"].createElement(
	            'tr',
	            { key: index },
	            _react2["default"].createElement(
	              'td',
	              { className: 'td_head' },
	              function () {
	                // 储存每条信息里需要用到的数据
	                FenzuNum[index] = list.groupNum;
	                ZhuanjiaNum[index] = list.expertNum;
	              }()
	            ),
	            _react2["default"].createElement('td', null),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement('input', {
	                type: 'checkbox',
	                id: 'list-' + index,
	                onChange: _this8.check.bind(_this8, list.expertGroup, list.expertNum, list, index)
	              }),
	              _react2["default"].createElement(
	                'label',
	                { htmlFor: 'list-' + index },
	                _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'div',
	                { className: 'show_fzx' },
	                _react2["default"].createElement(
	                  'span',
	                  { onClick: _this8.option.bind(_this8, 'showZJ', list.expertGroup, list.groupItem) },
	                  list.groupItem
	                ),
	                _react2["default"].createElement('br', null),
	                _react2["default"].createElement(
	                  'span',
	                  { onClick: _this8.option.bind(_this8, 'showZJ', list.expertGroup, list.groupItem) },
	                  '(' + list.expertNum + ')'
	                )
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'div',
	                { className: 'show_fzx' },
	                _react2["default"].createElement(
	                  'span',
	                  { onClick: _this8.option.bind(_this8, 'showKC', list.expertGroup, list.groupItem) },
	                  list.groupItem
	                ),
	                _react2["default"].createElement('br', null),
	                _react2["default"].createElement(
	                  'span',
	                  { onClick: _this8.option.bind(_this8, 'showKC', list.expertGroup, list.groupItem) },
	                  '(' + list.courseNum + ')'
	                )
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement('input', { type: 'text', disabled: list.state === 1 || !list.cz[0].able, onBlur: _this8.num_input_blur.bind(_this8, index), onChange: _this8.input_num.bind(_this8, index), defaultValue: list.groupNum })
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'span',
	                null,
	                list.state === 1 ? '已分配' : '未分配'
	              )
	            ),
	            _react2["default"].createElement(
	              'td',
	              null,
	              _react2["default"].createElement(
	                'div',
	                null,
	                list.cz.map(function (e, innerIndex) {
	                  return _react2["default"].createElement(
	                    'span',
	                    { key: innerIndex, onClick: e.able ? _this8.option.bind(_this8, e.name, list.expertGroup, FenzuNum[index] || list.groupNum, list.groupItem, index) : '', title: e.tips, className: e.able ? 'able' : 'disable' },
	                    e.name
	                  );
	                }),
	                list.cz[0].able ? '' : _react2["default"].createElement(
	                  'div',
	                  { style: { fontSize: '12px', color: 'red' } },
	                  list.cz[0].tips
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

	      this.allCheck.onclick = function (eve) {
	        if (eve.target.checked) {
	          // 情况选中的项
	          Checks = [];
	          _this9.props.Lists.forEach(function (e, index) {
	            // 填充被选中的项（所有）
	            Checks.push(index);
	            _this9.lists.push(e.expertGroup);
	            Nums.push(NumsCache[index] || e.expertNum);
	          });
	          for (var i = 0, end = _this9.props.Lists.length; i < end; i++) {
	            Items[i] = _this9.props.Lists[i];
	          }
	        } else {
	          _this9.lists = [];
	          Nums = [];
	          Items.fill('');
	        }
	        Array.from(document.querySelectorAll('tbody input[type="checkbox"]')).forEach(function (e) {
	          return e.checked = eve.target.checked;
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

	var Poplist = function (_React$Component3) {
	  _inherits(Poplist, _React$Component3);

	  function Poplist(props) {
	    _classCallCheck(this, Poplist);

	    var _this10 = _possibleConstructorReturn(this, (Poplist.__proto__ || Object.getPrototypeOf(Poplist)).call(this, props));

	    _this10.state = {
	      list: [],
	      TP: {
	        page: 1,
	        pages: 0,
	        total: 0
	      }
	    };
	    return _this10;
	  }

	  _createClass(Poplist, [{
	    key: '_get_list',
	    value: function _get_list(p) {
	      var _this11 = this;

	      var type = this.props.type === 'showZJ' ? 'getZjfzList' : 'getKcfzList';
	      var dat = {};
	      if (this.props.type === 'showZJ') {
	        dat = {
	          unifyCode: getCookie("userId"),
	          evaluateGroupBatch: this.props.fzpc,
	          evaluateName: this.ZJ.value,
	          group: this.props.fzx,
	          page: this.state.TP.page,
	          count: _POPCOUNT
	        };
	      } else {
	        dat = {
	          unifyCode: getCookie("userId"),
	          reviewBatch: parseHash(window.location.href).wppc,
	          courseName: this.ZJ.value,
	          group: this.props.fzx,
	          page: this.state.TP.page,
	          count: _POPCOUNT
	        };
	      }
	      ajax({
	        url: courseCenter.host + type,
	        data: dat,
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result !== 100) {
	            return;
	          }
	          _this11.setState({
	            list: datas.data.courseGroupList || datas.data.evaluateGroupList,
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
	      var _this12 = this;

	      var thead = '';
	      if (this.props.type === 'showZJ') {
	        thead = _react2["default"].createElement(
	          'thead',
	          null,
	          _react2["default"].createElement(
	            'tr',
	            null,
	            _react2["default"].createElement(
	              'td',
	              { width: '25%' },
	              '\u8D26\u53F7'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '25%' },
	              '\u59D3\u540D'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '25%' },
	              '\u5DE5\u4F5C\u5355\u4F4D'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '25%' },
	              '\u8054\u7CFB\u7535\u8BDD'
	            )
	          )
	        );
	      } else {
	        thead = _react2["default"].createElement(
	          'thead',
	          null,
	          _react2["default"].createElement(
	            'tr',
	            null,
	            _react2["default"].createElement(
	              'td',
	              { width: '30%' },
	              '\u8BFE\u7A0B\u540D\u79F0'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '15%' },
	              '\u8BFE\u7A0B\u7F16\u53F7'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '30%' },
	              '\u5F00\u8BFE\u5B66\u9662'
	            ),
	            _react2["default"].createElement(
	              'td',
	              { width: '25%' },
	              '\u7CFB\u90E8\u4E2D\u5FC3'
	            )
	          )
	        );
	      }
	      var tbody = [];
	      if (this.props.type === 'showZJ') {
	        tbody = [];
	        this.state.list.forEach(function (e) {
	          e.evaluates.forEach(function (m) {
	            tbody.push(_react2["default"].createElement(
	              'tr',
	              { key: m.zjid },
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.zjid
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.xm
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.dw
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.lxdh
	              )
	            ));
	          });
	        });
	      } else {
	        tbody = [];
	        this.state.list.forEach(function (e) {
	          e.courseList.forEach(function (m) {
	            tbody.push(_react2["default"].createElement(
	              'tr',
	              { key: m.kcbh },
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.kcmc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.kcbh
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.kkxymc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                m.jysmc
	              )
	            ));
	          });
	        });
	      }

	      if (tbody.length === 0) {
	        tbody = _react2["default"].createElement(
	          'tr',
	          null,
	          _react2["default"].createElement(
	            'td',
	            { colSpan: 4 },
	            _react2["default"].createElement('img', { className: 'pop-list-err', src: '../../imgs/public/error.png', style: { width: '200px' } }),
	            _react2["default"].createElement(
	              'div',
	              null,
	              '\u6CA1\u6709\u6570\u636E\uFF01'
	            )
	          )
	        );
	      }

	      return _react2["default"].createElement(
	        'div',
	        { id: 'poplist', style: { padding: '0 40px', overflowY: 'auto' } },
	        _react2["default"].createElement(
	          'div',
	          { id: 'ops' },
	          _react2["default"].createElement(
	            'p',
	            null,
	            this.props.fzx
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'searchZJ' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              this.props.type.indexOf('ZJ') === -1 ? '课程名称：' : '专家姓名：'
	            ),
	            _react2["default"].createElement('input', { type: 'text', ref: function ref(inp) {
	                return _this12.ZJ = inp;
	              } }),
	            _react2["default"].createElement(
	              'button',
	              { ref: function ref(btn) {
	                  return _this12.btn = btn;
	                }, onClick: this._get_list.bind(this, 1) },
	              '\u641C\u7D22'
	            )
	          )
	        ),
	        _react2["default"].createElement(
	          'div',
	          { id: 'pop_table_body' },
	          _react2["default"].createElement(
	            'table',
	            null,
	            thead,
	            _react2["default"].createElement(
	              'tbody',
	              null,
	              tbody
	            )
	          )
	        ),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this12._get_list(p);
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
	      // 重设页面高度
	      var bdHeight = document.getElementById('poplist').scrollHeight;
	      var h = +window.frameElement.height;
	      if (bdHeight > 537) {
	        window.frameElement.height = h + bdHeight - 537;
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
	      var _this14 = this;

	      var _props = this.props,
	          type = _props.type,
	          names = _props.names,
	          groupItem = _props.groupItem;

	      var MAP = {
	        "撤销": "撤销",
	        "自动分配": "自动分配",
	        "批量分配": "批量分配",
	        "批量撤销": "批量撤销"
	      };

	      switch (type) {
	        case '撤销':
	        case '自动分配':
	          return _react2["default"].createElement(
	            'div',
	            { id: 'background', ref: function ref(div) {
	                return _this14.background = div;
	              } },
	            _react2["default"].createElement(
	              'div',
	              { id: 'popbody', ref: 'pb' },
	              _react2["default"].createElement(
	                'div',
	                { id: 'msg' },
	                _react2["default"].createElement(
	                  'p',
	                  null,
	                  '\u786E\u5B9A\u8981' + (MAP[type] + groupItem) + '?'
	                )
	              ),
	              _react2["default"].createElement(
	                'div',
	                { id: 'popup_option' },
	                _react2["default"].createElement(
	                  'button',
	                  { id: 'popup_OK', ref: function ref(btn) {
	                      return _this14.OK = btn;
	                    } },
	                  '\u786E\u5B9A'
	                ),
	                _react2["default"].createElement(
	                  'button',
	                  { id: 'popup_back', ref: function ref(btn) {
	                      return _this14.back = btn;
	                    } },
	                  '\u53D6\u6D88'
	                )
	              )
	            )
	          );
	          break;
	        case '批量分配':
	        case '批量撤销':
	          return _react2["default"].createElement(
	            'div',
	            { id: 'background', ref: function ref(div) {
	                return _this14.background = div;
	              } },
	            _react2["default"].createElement(
	              'div',
	              { id: 'popbody', ref: 'pb' },
	              _react2["default"].createElement(
	                'div',
	                { id: 'msg' },
	                _react2["default"].createElement(
	                  'p',
	                  null,
	                  '\u786E\u5B9A\u8981' + MAP[type] + '?'
	                )
	              ),
	              _react2["default"].createElement(
	                'div',
	                { id: 'popup_option' },
	                _react2["default"].createElement(
	                  'button',
	                  { id: 'popup_OK', ref: function ref(btn) {
	                      return _this14.OK = btn;
	                    } },
	                  '\u786E\u5B9A'
	                ),
	                _react2["default"].createElement(
	                  'button',
	                  { id: 'popup_back', ref: function ref(btn) {
	                      return _this14.back = btn;
	                    } },
	                  '\u53D6\u6D88'
	                )
	              )
	            )
	          );
	          break;
	        case 'showZJ':
	        case 'showKC':
	          return _react2["default"].createElement(
	            'div',
	            {
	              id: 'background',
	              ref: function ref(div) {
	                return _this14.background = div;
	              },
	              onClick: function onClick(e) {
	                return _this14.delete_popup(e);
	              }
	            },
	            _react2["default"].createElement(
	              'div',
	              { id: 'poplist', ref: 'pb', onClick: function onClick(e) {
	                  return e.stopPropagation;
	                } },
	              _react2["default"].createElement(Poplist, { fzpc: this.props.id, fzx: this.props.names, type: type })
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
	      if (window.frameElement) {
	        var H = document.body.scrollHeight;
	        if (this.background.height > parseInt(document.body.scrollHeight)) {
	          H = this.background.scrollHeight;
	        }
	        window.frameElement.height = H;
	      }

	      var _props2 = this.props,
	          id = _props2.id,
	          type = _props2.type;

	      var dat = {};

	      switch (type) {
	        case "撤销":
	        case '批量撤销':
	          dat = {
	            unifyCode: getCookie("userId"),
	            ID: parseHash(window.location.href).id,
	            expertGroupItem: this.props.groupItem
	          };
	          break;
	        case "自动分配":
	          dat = {
	            unifyCode: getCookie("userId"),
	            ID: parseHash(window.location.href).id,
	            expertGroupItem: this.props.groupItem,
	            groupNum: FenzuNum[this.props.index]
	          };
	          break;
	        case '批量分配':
	          var A = [];
	          var B = [];
	          Checks.forEach(function (e) {
	            A.push(Items[e].groupItem);
	            B.push(FenzuNum[e]);
	          });
	          dat = {
	            unifyCode: getCookie("userId"),
	            ID: parseHash(window.location.href).id,
	            expertGroupItem: A.join(','),
	            groupNum: B.join(',')
	            // expertGroupItem: this.props.groupItem,
	            // groupNum: this.props.names
	          };
	          break;
	        default:
	          break;
	      }
	      this.OK && (this.OK.onclick = function () {
	        var data_map = {
	          "撤销": "reviewUndo",
	          "批量撤销": "reviewUndo",
	          "自动分配": "reviewAutoAlloc",
	          "批量分配": "reviewAutoAlloc"
	        };
	        ajax({
	          url: courseCenter.host + data_map[type],
	          data: dat,
	          success: function success(gets) {
	            var datas = JSON.parse(gets);
	            if (datas.meta.result == 100) {
	              cancel_popup();
	              WPGL._get_list();
	            }
	          }
	        });
	      });
	      this.back && (this.back.onclick = function () {
	        _reactDom2["default"].unmountComponentAtNode(document.getElementById('popup'));
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      if (window.frameElement) {
	        var H = document.body.offsetHeight;
	        if (this.background.style.height.split('px')[0] > parseInt(document.body.offsetHeight)) {
	          H = this.background.style.height.split('px')[0];
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
	  }]);

	  return Popup;
	}(_react2["default"].Component);

	function Creat_popup(type, names, id, groupItem, index) {
	  var popup_datas = {
	    type: type,
	    names: names,
	    id: id,
	    groupItem: groupItem,
	    index: index
	  };
	  var popup = _reactDom2["default"].render(_react2["default"].createElement(Popup, popup_datas), document.getElementById('popup'));
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