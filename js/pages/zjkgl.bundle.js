webpackJsonp([10],{

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

	var _COUNT = 10;
	var ajax = __webpack_require__(159);
	var Fanye = __webpack_require__(160);
	var masterNames = [];

	function SET(key, value) {
	  sessionStorage.setItem("zjkgl-" + key, value);
	  return value;
	}

	function GET(key) {
	  return sessionStorage.getItem("zjkgl-" + key);
	}

	var Option = function (_React$Component) {
	  _inherits(Option, _React$Component);

	  function Option(props) {
	    _classCallCheck(this, Option);

	    var _this = _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).call(this, props));

	    _this.search_data = {
	      zh: GET('zh') || '',
	      xm: GET('xm') || '',
	      gzdw: GET('gzdw') || '',
	      ssxy: GET('ssxy') || '',
	      jsxm: GET('jsxm') || '',
	      state: +GET('qy') === +GET('ty') ? '' : +GET('qy')
	    };
	    _this.state = {
	      // 取不到当前默认的masterstate就默认为out
	      master: GET("master") || 'out',
	      list: [],
	      TP: {
	        page: 1,
	        pages: 1,
	        total: 1
	      }
	    };
	    return _this;
	  }

	  _createClass(Option, [{
	    key: 'creat_option_down',
	    value: function creat_option_down() {
	      var _this2 = this;

	      var master = this.state.master;

	      var inputs = null;
	      switch (master) {
	        case 'out':
	          inputs = _react2["default"].createElement(
	            'div',
	            { id: 'option_input' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u8D26\u53F7\uFF1A'
	            ),
	            _react2["default"].createElement('input', { type: 'text', ref: 'zhanghao' }),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u59D3\u540D\uFF1A'
	            ),
	            _react2["default"].createElement('input', { type: 'text', ref: 'name' }),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u5DE5\u4F5C\u5355\u4F4D\uFF1A'
	            ),
	            _react2["default"].createElement('input', { type: 'text', ref: 'danwei' })
	          );
	          break;
	        case 'in':
	          inputs = _react2["default"].createElement(
	            'div',
	            { id: 'option_input' },
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u6240\u5C5E\u5B66\u9662\uFF1A'
	            ),
	            _react2["default"].createElement(
	              'select',
	              { id: 'xueyuan', ref: function ref(select) {
	                  return _this2.xueyuan = select;
	                } },
	              _react2["default"].createElement(
	                'option',
	                { value: '' },
	                "请选择"
	              )
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u6559\u5E08\u59D3\u540D\uFF1A'
	            ),
	            _react2["default"].createElement('input', { type: 'text', ref: 'jsxm' })
	          );
	          break;
	        default:
	          inputs = null;
	          break;
	      }
	      return _react2["default"].createElement(
	        'div',
	        { id: 'down' },
	        inputs,
	        _react2["default"].createElement(
	          'div',
	          { id: 'option_search' },
	          _react2["default"].createElement(
	            'span',
	            null,
	            '\u8D26\u53F7\u72B6\u6001\uFF1A'
	          ),
	          _react2["default"].createElement('input', { type: 'checkbox', id: 'qy', ref: function ref(input) {
	              return _this2.qy = input;
	            } }),
	          _react2["default"].createElement(
	            'label',
	            { htmlFor: 'qy' },
	            _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	          ),
	          _react2["default"].createElement(
	            'span',
	            null,
	            '\u542F\u7528'
	          ),
	          _react2["default"].createElement('input', { type: 'checkbox', id: 'ty', ref: function ref(input) {
	              return _this2.ty = input;
	            } }),
	          _react2["default"].createElement(
	            'label',
	            { htmlFor: 'ty' },
	            _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	          ),
	          _react2["default"].createElement(
	            'span',
	            null,
	            '\u505C\u7528'
	          ),
	          _react2["default"].createElement(
	            'button',
	            { ref: function ref(search) {
	                return _this2.search = search;
	              }, id: 'search' },
	            '\u641C\u7D22'
	          )
	        )
	      );
	    }
	  }, {
	    key: 'insert_xueyuan',
	    value: function insert_xueyuan() {
	      var _this3 = this;

	      ajax({
	        url: courseCenter.host + 'getCollege',
	        data: {
	          unifyCode: getCookie("userId")
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          var options = "<option value=''>请选择</option>";

	          datas.data.map(function (e) {
	            options += '<option value=' + e.kkxymc + ' ' + (e.kkxymc == GET('ssxy') ? "selected" : '') + '>' + e.kkxymc + '</option>';
	          });
	          _this3.xueyuan.innerHTML = options;
	          _this3.xueyuan.onchange = function () {
	            _this3.search_handler();
	          };
	        }
	      });
	    }
	  }, {
	    key: 'change_master_state',
	    value: function change_master_state(state) {
	      var _this4 = this;

	      if (state === 'in') {
	        this.insert_xueyuan();
	      }
	      if (state === this.state.master) {
	        return;
	      }

	      Array.from(document.querySelectorAll("#down input[type='text']")).map(function (e) {
	        return e.value = "";
	      });

	      sessionStorage.clear();
	      SET("master", state);

	      this.qy.checked = false;
	      this.ty.checked = false;
	      Array.from(document.querySelectorAll("#down input[type='text']")).map(function (e) {
	        return e.value = "";
	      });

	      this.setState({
	        master: state,
	        list: []
	      }, function () {
	        _this4.get_list(1);
	      });
	    }
	  }, {
	    key: 'search_handler',
	    value: function search_handler() {
	      switch (this.state.master) {
	        case 'in':
	          this.search_data = {
	            ssxy: SET('ssxy', this.xueyuan.value),
	            jsxm: SET("jsxm", this.refs.jsxm.value)
	          };
	          break;
	        case 'out':
	          this.search_data = {
	            zh: SET('zh', this.refs.zhanghao.value),
	            xm: SET('xm', this.refs.name.value),
	            gzdw: SET('gzdw', this.refs.danwei.value)
	          };
	          break;
	      }
	      SET('qy', +this.qy.checked);
	      SET('ty', +this.ty.checked);
	      this.search_data.state = this.qy.checked === this.ty.checked ? '' : +this.qy.checked;
	      this.get_list(1);
	    }

	    // get datas from this.search_data

	  }, {
	    key: 'get_list',
	    value: function get_list(p) {
	      var _this5 = this;

	      var data = {};
	      var session_page = p || +GET(this.state.master + "page") || 1;
	      if (this.state.master === 'out') {
	        data = {
	          unifyCode: getCookie("userId"),
	          userId: this.search_data.zh,
	          userName: this.search_data.xm,
	          department: this.search_data.gzdw,
	          state: this.search_data.state,
	          page: session_page,
	          count: _COUNT,
	          type: ['in', 'out'].indexOf(this.state.master)
	        };
	      } else if (this.state.master === 'in') {
	        data = {
	          unifyCode: getCookie("userId"),
	          userId: "",
	          userName: this.search_data.jsxm,
	          department: this.search_data.ssxy,
	          state: this.search_data.state,
	          page: session_page,
	          count: _COUNT,
	          type: ['in', 'out'].indexOf(this.state.master)
	        };
	      }
	      ajax({
	        url: courseCenter.host + "getZjList",
	        data: data,
	        success: function success(gets) {
	          SET(_this5.state.master + "page", session_page);
	          var datas = JSON.parse(gets);
	          _this5.setState({
	            TP: {
	              page: session_page,
	              pages: datas.data.totalPages,
	              total: datas.data.total
	            },
	            list: datas.data.zjList
	          });
	        }
	      });
	    }
	  }, {
	    key: 'set_default',
	    value: function set_default() {
	      this.qy.checked = +GET('qy');
	      this.ty.checked = +GET('ty');
	      switch (this.state.master) {
	        case 'in':
	          this.refs.jsxm.value = GET('jsxm') || '';
	          this.search_data = {
	            ssxy: GET('ssxy') || '',
	            jsxm: GET('jsxm') || ''
	          };
	          break;
	        case 'out':
	          this.refs.zhanghao.value = GET('zh') || '';
	          this.refs.name.value = GET('xm') || '';
	          this.refs.danwei.value = GET('gzdw') || '';
	          this.search_data = {
	            zh: GET('zh') || '',
	            xm: GET('xm') || '',
	            gzdw: GET('gzdw') || ''
	          };
	          break;
	      }
	      this.search_data.state = this.qy.checked === this.ty.checked ? '' : +this.qy.checked;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this6 = this;

	      var master = this.state.master;

	      return _react2["default"].createElement(
	        'div',
	        { id: 'Option' },
	        _react2["default"].createElement(
	          'div',
	          { id: 'option_bar' },
	          _react2["default"].createElement(
	            'div',
	            { id: 'top' },
	            _react2["default"].createElement(
	              'button',
	              { className: 'option_big_btn', ref: function ref(button) {
	                  return _this6.add = button;
	                } },
	              '\u6DFB\u52A0\u4E13\u5BB6'
	            ),
	            _react2["default"].createElement(
	              'button',
	              { className: 'option_big_btn', ref: function ref(button) {
	                  return _this6.PLdelete = button;
	                } },
	              '\u6279\u91CF\u5220\u9664'
	            ),
	            this.state.master === 'out' ? _react2["default"].createElement(
	              'button',
	              { className: 'option_big_btn', ref: function ref(button) {
	                  return _this6.change = button;
	                } },
	              '\u4FEE\u6539\u5BC6\u7801'
	            ) : ''
	          ),
	          _react2["default"].createElement(
	            'div',
	            { id: 'mid' },
	            _react2["default"].createElement('input', {
	              type: 'radio',
	              name: 'master',
	              id: 'master_in',
	              ref: function ref(input) {
	                return _this6.master_out = input;
	              },
	              onChange: function onChange() {
	                _this6.change_master_state('out');
	              },
	              defaultChecked: master === 'out'
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'master_in' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u663E\u793A\u6821\u5916\u4E13\u5BB6'
	            ),
	            _react2["default"].createElement('input', {
	              type: 'radio',
	              name: 'master',
	              id: 'master_out',
	              ref: function ref(input) {
	                return _this6.master_in = input;
	              },
	              onChange: function onChange() {
	                _this6.change_master_state('in');
	              },
	              defaultChecked: master === 'in'
	            }),
	            _react2["default"].createElement(
	              'label',
	              { htmlFor: 'master_out' },
	              _react2["default"].createElement('img', { src: '../../imgs/public/hook.png' })
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u663E\u793A\u6821\u5185\u4E13\u5BB6'
	            )
	          ),
	          this.creat_option_down()
	        ),
	        _react2["default"].createElement(List, { list: this.state.list, master: this.state.master, ref: 'list' }),
	        _react2["default"].createElement(Fanye, { TP: this.state.TP, callback: function callback(p) {
	            _this6.get_list(p);
	          } })
	      );
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this7 = this;

	      this.set_default();
	      var pop = document.getElementById('popup');
	      // first mount insert college list
	      if (this.state.master === 'in') {
	        this.insert_xueyuan();
	      }

	      // add master
	      this.add.onclick = function () {
	        window.location.href = "./masterAddEditor.html";
	      };
	      this.get_list();

	      // PiLiangDelete
	      this.PLdelete.onclick = function () {
	        Creat_popup('PLdelete', masterNames, _this7.refs.list.ids);
	        pop.style.display = 'block';
	      };

	      // change password
	      this.change.onclick = function () {
	        if (_this7.state.master === 'out') {
	          if (_this7.refs.list.ids.length > 1) {
	            alert('一次只能修改一个专家的密码！');
	            return;
	          }
	          if (_this7.refs.list.ids.length === 0) {
	            alert('请先选中要修改密码的专家！');
	            return;
	          }
	          Creat_popup('change_PW', masterNames, _this7.refs.list.ids[0]);
	          pop.style.display = 'block';
	        };
	      };

	      // search
	      this.search.onclick = this.search_handler.bind(this);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      this.set_default();
	      if (window.frameElement) {
	        window.frameElement.height = document.body.offsetHeight;
	      }
	    }
	  }]);

	  return Option;
	}(_react2["default"].Component);

	var List = function (_React$Component2) {
	  _inherits(List, _React$Component2);

	  function List(props) {
	    _classCallCheck(this, List);

	    var _this8 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

	    _this8.ids = [];
	    return _this8;
	  }

	  _createClass(List, [{
	    key: 'creat_thead',
	    value: function creat_thead() {
	      var _this9 = this;

	      var master = this.props.master;

	      switch (master) {
	        case 'out':
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
	              _react2["default"].createElement('td', { width: '5px' }),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                _react2["default"].createElement('input', {
	                  type: 'checkbox',
	                  id: 'allcheck',
	                  ref: function ref(check) {
	                    return _this9.allcheck = check;
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
	                { width: '15%' },
	                '\u8D26\u53F7'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '15%' },
	                '\u59D3\u540D'
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                '\u5DE5\u4F5C\u5355\u4F4D'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '20%' },
	                '\u8054\u7CFB\u7535\u8BDD'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '7%' },
	                '\u8D26\u53F7\u72B6\u6001'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '15%' },
	                '\u64CD\u4F5C'
	              ),
	              _react2["default"].createElement('td', { width: '0px' }),
	              _react2["default"].createElement(
	                'td',
	                { className: 'righttd' },
	                _react2["default"].createElement('div', null)
	              )
	            )
	          );
	          break;

	        case 'in':
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
	              _react2["default"].createElement('td', { width: '5px' }),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                _react2["default"].createElement('input', {
	                  type: 'checkbox',
	                  id: 'allcheck',
	                  ref: function ref(check) {
	                    return _this9.allcheck = check;
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
	                { width: '15%' },
	                '\u59D3\u540D'
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                '\u5B66\u9662'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '10%' },
	                '\u8D26\u53F7\u72B6\u6001'
	              ),
	              _react2["default"].createElement(
	                'td',
	                { width: '15%' },
	                '\u64CD\u4F5C'
	              ),
	              _react2["default"].createElement('td', { width: '0px' }),
	              _react2["default"].createElement(
	                'td',
	                { className: 'righttd' },
	                _react2["default"].createElement('div', null)
	              )
	            )
	          );
	          break;
	      }
	    }
	  }, {
	    key: 'creat_tbody',
	    value: function creat_tbody() {
	      var _this10 = this;

	      if (this.props.list.length === 0) {
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

	      var master = this.props.master;

	      switch (master) {
	        case 'out':
	          return _react2["default"].createElement(
	            'tbody',
	            null,
	            this.props.list.map(function (e, index) {
	              return _react2["default"].createElement(
	                'tr',
	                { key: index },
	                _react2["default"].createElement('td', { className: 'lefttd' }),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement('input', {
	                    type: 'checkbox',
	                    id: "input-" + index,
	                    value: e.id + "#" + e.xm,
	                    onChange: _this10.check.bind(_this10, e.id, e.xm)
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
	                  e.id
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.xm
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.dw
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.lxdh
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.zt
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'edit', e.id, e.xm) },
	                    '\u7F16\u8F91'
	                  ),
	                  _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'del', e.id, e.xm) },
	                    '\u5220\u9664'
	                  ),
	                  e.zt === '可用' ? _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'stop', e.id, e.xm) },
	                    '\u505C\u7528'
	                  ) : _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'open', e.id, e.xm) },
	                    '\u542F\u7528'
	                  )
	                ),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement('td', { className: 'righttd' })
	              );
	            })
	          );
	          break;

	        case 'in':
	          return _react2["default"].createElement(
	            'tbody',
	            null,
	            this.props.list.map(function (e, index) {
	              return _react2["default"].createElement(
	                'tr',
	                { key: index },
	                _react2["default"].createElement('td', { className: 'lefttd' }),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement('input', {
	                    type: 'checkbox',
	                    id: "input-" + index,
	                    value: e.sfrzh + "#" + e.xm,
	                    onChange: _this10.check.bind(_this10, e.sfrzh, e.xm)
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
	                  e.xm
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.xymc
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  e.zt
	                ),
	                _react2["default"].createElement(
	                  'td',
	                  null,
	                  _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'del', e.sfrzh, e.xm) },
	                    '\u5220\u9664'
	                  ),
	                  e.zt === '可用' ? _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'stop', e.sfrzh, e.xm) },
	                    '\u505C\u7528'
	                  ) : _react2["default"].createElement(
	                    'a',
	                    { href: '#', onClick: _this10.option.bind(_this10, 'open', e.sfrzh, e.xm) },
	                    '\u542F\u7528'
	                  )
	                ),
	                _react2["default"].createElement('td', null),
	                _react2["default"].createElement('td', { className: 'righttd' })
	              );
	            })
	          );
	          break;
	      }
	    }
	  }, {
	    key: 'option',
	    value: function option(_option, id, name, eve) {
	      eve.preventDefault();
	      switch (_option) {
	        case 'edit':
	          window.location.href = "./masterAddEditor.html?isEditor=true&masterId=" + id;
	          break;
	        case 'del':
	          // ajax();
	          Creat_popup('delete', name, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'open':
	          // ajax();
	          Creat_popup('open', name, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        case 'stop':
	          // ajax();
	          Creat_popup('stop', name, id);
	          document.getElementById('popup').style.display = "block";
	          break;
	        default:
	          break;
	      }
	    }
	  }, {
	    key: 'check',
	    value: function check(id, name, eve) {
	      this.allcheck.checked = false;
	      if (eve.target.checked) {
	        // add
	        this.ids.push(id);
	        masterNames.push(name);
	      } else {
	        // delet
	        this.ids = this.ids.filter(function (e) {
	          return e !== id;
	        });
	        masterNames = masterNames.filter(function (e) {
	          return e !== name;
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      masterNames = [];
	      this.ids = [];
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
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this11 = this;

	      this.allcheck.onchange = function (eve) {
	        _this11.ids = [];
	        masterNames = [];
	        var checks = Array.from(document.querySelectorAll('tbody td input[type="checkbox"]'));
	        checks.map(function (e) {
	          (e.checked = eve.target.checked) && _this11.ids.push(e.value.split("#")[0]) && masterNames.push(e.value.split("#")[1]);
	        });
	      };
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      Array.from(document.querySelectorAll('input[type="checkbox"]')).map(function (e) {
	        return e.checked = false;
	      });
	    }
	  }]);

	  return List;
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
	      var _this13 = this;

	      var _props = this.props,
	          type = _props.type,
	          names = _props.names;

	      var MAP = {
	        "PLdelete": "删除",
	        "delete": "删除",
	        "open": "启用",
	        "stop": "停用"
	      };

	      switch (type) {
	        case 'PLdelete':
	        case 'delete':
	        case 'open':
	        case 'stop':
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
	        case 'change_PW':
	          return _react2["default"].createElement(
	            'div',
	            { id: 'popbody', style: { height: "350px" }, ref: 'pb' },
	            _react2["default"].createElement(
	              'div',
	              { id: 'title' },
	              _react2["default"].createElement(
	                'p',
	                null,
	                '\u4FEE\u6539\u5BC6\u7801'
	              )
	            ),
	            _react2["default"].createElement(
	              'div',
	              { id: 'inputs' },
	              _react2["default"].createElement(
	                'div',
	                null,
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'left_span' },
	                  _react2["default"].createElement(
	                    'span',
	                    { className: 'warn' },
	                    '*'
	                  ),
	                  '\u65B0\u5BC6\u7801'
	                ),
	                _react2["default"].createElement('input', { type: 'password', ref: 'xmm' }),
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'tips' },
	                  '\u5BC6\u7801\u957F\u5EA6\u81F3\u5C116\u4F4D'
	                )
	              ),
	              _react2["default"].createElement(
	                'div',
	                null,
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'left_span' },
	                  _react2["default"].createElement(
	                    'span',
	                    { className: 'warn' },
	                    '*'
	                  ),
	                  '\u65B0\u5BC6\u7801\u786E\u8BA4'
	                ),
	                _react2["default"].createElement('input', { type: 'password', ref: 'xmmqr' }),
	                _react2["default"].createElement(
	                  'span',
	                  { className: 'tips' },
	                  '\u8BF7\u518D\u6B21\u8F93\u5165\u65B0\u5BC6\u7801'
	                )
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
	        default:
	          return _react2["default"].createElement('div', null);
	          break;
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this14 = this;

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
	            usersId: id,
	            type: ['in', 'out'].indexOf(OptionComponent.state.master)
	          };
	          break;
	        case "open":
	          dat = {
	            unifyCode: getCookie("userId"),
	            userId: id,
	            state: 1,
	            type: ['in', 'out'].indexOf(OptionComponent.state.master)
	          };
	          break;
	        case "stop":
	          dat = {
	            unifyCode: getCookie("userId"),
	            userId: id,
	            state: 0,
	            type: ['in', 'out'].indexOf(OptionComponent.state.master)
	          };
	          break;
	        default:
	          break;
	      }

	      this.OK.onclick = function () {
	        var data_map = {
	          "PLdelete": "deleteZj",
	          "delete": "deleteZj",
	          "open": "updateZjState",
	          "stop": "updateZjState",
	          "change_PW": "updateZjPassWord"
	        };
	        if (type == 'change_PW') {
	          if (!(_this14.refs.xmm.value && _this14.refs.xmmqr.value)) {
	            alert("请检查参数！");
	            return;
	          }
	          if (_this14.refs.xmm.value !== _this14.refs.xmmqr.value) {
	            alert("新密码确认错误，请检查！");
	            return;
	          } else {
	            dat = {
	              unifyCode: getCookie("userId"),
	              userId: _this14.props.id,
	              oldPassWord: '',
	              // oldPassWord: this.refs.dqmm.value,
	              newPassWord: _this14.refs.xmm.value
	            };
	          }
	        }
	        ajax({
	          url: courseCenter.host + data_map[type],
	          data: dat,
	          success: function success(gets) {
	            var datas = JSON.parse(gets);
	            if (datas.meta.result == 100) {
	              alert("操作成功！");
	              cancel_popup();
	              OptionComponent.get_list();
	            } else {
	              // alert("操作失败");
	            }
	          }
	        });
	      };
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

	  // click to close popup
	  document.getElementById('popup').onclick = cancel_popup;
	}

	function cancel_popup() {
	  var popup = document.getElementById('popup');
	  popup.style.display = "none";
	  _reactDom2["default"].unmountComponentAtNode(popup);
	}

	var OptionComponent = _reactDom2["default"].render(_react2["default"].createElement(Option, null), document.getElementById('zjkgl'));

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