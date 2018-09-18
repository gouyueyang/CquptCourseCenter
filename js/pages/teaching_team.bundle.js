webpackJsonp([0],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BluMUI = __webpack_require__(1);
	var ajax = __webpack_require__(160);

	// 需要获取用户id
	var User = {
	  name: "",
	  id: ""
	};
	User.id = getCookie('userId');

	BluMUI.result.user_id = User.id;
	ajax({
	  url: courseCenter.host + 'getMenu',
	  data: {
	    unifyCode: User.id,
	    module: 11
	  },
	  success: function success(gets) {
	    // 未获取到数据则刷新页面
	    if (JSON.parse(gets).meta.result != 100) {
	      alert("数据获取失败，请重新登录！");
	    }
	    var datas = JSON.parse(gets);
	    BluMUI.create({
	      id: 'Tab',
	      role: datas.data
	    }, 'CreateTab', document.getElementById('table_title'));
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
	var _count = 10;

	//创建绿色的表头（又是绿色= =！）

	var BlueMUI_CreateThead = function (_React$Component) {
	  _inherits(BlueMUI_CreateThead, _React$Component);

	  function BlueMUI_CreateThead(props) {
	    _classCallCheck(this, BlueMUI_CreateThead);

	    // this.bind_pages=this.bind_pages.bind(this);
	    var _this = _possibleConstructorReturn(this, (BlueMUI_CreateThead.__proto__ || Object.getPrototypeOf(BlueMUI_CreateThead)).call(this, props));

	    _this.state = {
	      lists: _this.props.lists,
	      page: _this.props.page || 1,
	      total: _this.props.total,
	      totalPages: _this.props.totalPages
	    };
	    return _this;
	  }

	  //根据权限创建绿色的表头（绿色……）


	  _createClass(BlueMUI_CreateThead, [{
	    key: 'thead_create',
	    value: function thead_create() {
	      //创建表头内容数组
	      var thead_items = [];
	      //填充表头内容
	      thead_items[0] = _react2["default"].createElement('td', { key: 'w1', width: '35px' });
	      thead_items[1] = _react2["default"].createElement(
	        'td',
	        { key: '0', width: '150px' },
	        '\u5E8F\u53F7'
	      );
	      switch (BluMUI.result.Tab.state.Rank) {
	        case 1:
	          thead_items[2] = _react2["default"].createElement(
	            'td',
	            { key: '1' },
	            '\u5B66\u9662'
	          );
	          thead_items[3] = _react2["default"].createElement(
	            'td',
	            { key: '2', width: '240px' },
	            '\u7CFB\u90E8\u4E2D\u5FC3\u540D\u79F0'
	          );
	          thead_items[4] = _react2["default"].createElement(
	            'td',
	            { key: '3', width: '300px' },
	            '\u7CFB\u90E8\u4E2D\u5FC3\u4E3B\u4EFB'
	          );
	          break;
	        case 2:
	        case 3:
	          thead_items[2] = _react2["default"].createElement(
	            'td',
	            { key: '1', width: '180px' },
	            '\u8BFE\u7A0B\u7F16\u53F7'
	          );
	          thead_items[3] = _react2["default"].createElement(
	            'td',
	            { key: '2' },
	            '\u8BFE\u7A0B\u540D\u79F0'
	          );
	          thead_items[4] = _react2["default"].createElement(
	            'td',
	            { key: '3', width: '150px' },
	            '\u8BFE\u7A0B\u8D1F\u8D23\u4EBA'
	          );
	          thead_items[5] = _react2["default"].createElement(
	            'td',
	            { key: '4', width: '280px' },
	            '\u8BFE\u7A0B\u56E2\u961F\u6210\u5458'
	          );
	          break;
	      }
	      thead_items.push(_react2["default"].createElement(
	        'td',
	        { key: thead_items.length + 1, width: '120px' },
	        '\u64CD\u4F5C'
	      ));
	      thead_items.push(_react2["default"].createElement('td', { key: 'w2', width: '39px' }));
	      return thead_items;
	    }
	  }, {
	    key: 'face_serch',
	    value: function face_serch(p) {
	      var _this2 = this;

	      // if(p==0||p==this.state.page) {
	      //   return;
	      // }
	      // let that=this;
	      ajax({
	        url: courseCenter.host + 'CourseMatainMsg',
	        data: {
	          type: BluMUI.result.Tab.state.Rank,
	          unifyCode: BluMUI.result.user_id,
	          page: p,
	          count: _count,
	          selectName: document.getElementById('jxtdss').value
	        },
	        success: function success(gets) {
	          var list = JSON.parse(gets);
	          _this2.setState({
	            lists: list.data.courseList,
	            page: p
	          });
	        }
	      });
	    }

	    //绑定翻页按钮事件（提出来是因为原来需要初始化和重渲染后再绑定）
	    // bind_pages() {
	    //   let that=this;
	    //   let fanye_out=this.refs.fanye_out;
	    //   if(fanye_out.refs.popup_fanye){
	    //     let fanye_bar=fanye_out.refs.popup_fanye.children;
	    //     let yema=fanye_bar.length;
	    //     for(let j=0;j<yema;j++) {
	    //       if(fanye_bar[j].innerText!='...') {
	    //         fanye_bar[j].onclick=function() {
	    //           let click_page= +this.innerText;
	    //           that.face_serch(click_page);
	    //         }
	    //       }
	    //     }
	    //   }

	    //   //搜索的前翻和后翻
	    //   if(fanye_out.refs.next&&fanye_out.refs.pre) {
	    //     fanye_out.refs.next.onclick=function() {
	    //       that.face_serch(that.state.page+1>that.state.totalPages?0:that.state.page+1);
	    //     }
	    //     fanye_out.refs.pre.onclick=function() {
	    //       that.face_serch(that.state.page-1<0?1:that.state.page-1);
	    //     }
	    //   }
	    // }

	    //组件加载后执行的事件

	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	    // this.bind_pages();


	    //组件重渲染后执行的事件

	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      // this.bind_pages();
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.setState({
	        lists: nextProps.lists,
	        page: nextProps.page
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'table-wrap' },
	        _react2["default"].createElement(
	          'table',
	          null,
	          _react2["default"].createElement(
	            'thead',
	            null,
	            _react2["default"].createElement(
	              'tr',
	              null,
	              this.thead_create()
	            )
	          ),
	          _react2["default"].createElement(BlueMUI_CreateTbody, { Lists: this.state.lists, Rank: BluMUI.result.Tab.state.Rank, page: this.state.page })
	        ),
	        _react2["default"].createElement(BlueMUI_CreateFanye, {
	          id: 'Out_fanye',
	          TP: { pages: this.state.totalPages, page: this.state.page, total: this.state.total },
	          ref: 'fanye_out',
	          callback: this.face_serch.bind(this)
	        })
	      );
	    }
	  }]);

	  return BlueMUI_CreateThead;
	}(_react2["default"].Component);

	//创建表身


	var BlueMUI_CreateTbody = function (_React$Component2) {
	  _inherits(BlueMUI_CreateTbody, _React$Component2);

	  function BlueMUI_CreateTbody(props) {
	    _classCallCheck(this, BlueMUI_CreateTbody);

	    var _this3 = _possibleConstructorReturn(this, (BlueMUI_CreateTbody.__proto__ || Object.getPrototypeOf(BlueMUI_CreateTbody)).call(this, props));

	    _this3.create_list = _this3.create_list.bind(_this3);
	    return _this3;
	  }

	  _createClass(BlueMUI_CreateTbody, [{
	    key: 'option',
	    value: function option(data, event) {
	      switch (this.props.Rank) {
	        case 1:
	          document.getElementById('body_head').style.display = 'none';
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreateAdding, { Rank: BluMUI.result.Tab.state.Rank, Leaders: data.Liders, Jysh: data.Jysh }), document.getElementById('list'));
	          break;
	        case 2:
	          document.getElementById('body_head').style.display = 'none';
	          var that = this;
	          //获取教学团队成员信息
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreateAdding, { Rank: BluMUI.result.Tab.state.Rank, Master: data.Master, Teachers: data.Teachers, Kcbh: data.Kcbh, Kcmc: data.Kcmc }), document.getElementById('list'));
	          break;
	        case 3:
	          document.getElementById('body_head').style.display = 'none';
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreateAdding, { Teachers: data.Teachers, Rank: BluMUI.result.Tab.state.Rank, Kcbh: data.Kcbh, Kcmc: data.Kcmc }), document.getElementById('list'));
	          break;
	      }
	      //将事件对象用来阻止链接跳转
	      arguments[arguments.length - 1].preventDefault();
	    }
	  }, {
	    key: 'create_list',
	    value: function create_list(all_lists) {
	      if (all_lists.length == 0) {
	        return _react2["default"].createElement(
	          'tr',
	          { id: 'No-data' },
	          _react2["default"].createElement(
	            'td',
	            null,
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
	      var j = 0;
	      var lists = [];
	      var teachers = []; //教师数组
	      var end = all_lists.length;
	      switch (BluMUI.result.Tab.state.Rank) {
	        case 1:
	          for (var i = 0; i < end; i++) {
	            lists.push(_react2["default"].createElement(
	              'tr',
	              { key: i },
	              _react2["default"].createElement('td', null),
	              _react2["default"].createElement(
	                'td',
	                null,
	                i + 1 + _count * (this.props.page - 1)
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[i].kkxymc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[i].jysmc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[i].officeLeadersName.map(function (e) {
	                  return _react2["default"].createElement(
	                    'span',
	                    { key: e.jyszr },
	                    e.jyszr
	                  );
	                })
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                _react2["default"].createElement(
	                  'a',
	                  { href: '#', onClick: this.option.bind(this, {
	                      Liders: all_lists[i].officeLeadersName,
	                      Kcbh: all_lists[i].kcbh,
	                      Kcmc: all_lists[i].kcmc,
	                      Jysh: all_lists[i].jysh
	                    }) },
	                  all_lists[i].officeLeadersName.length ? "修改" : "添加"
	                )
	              ),
	              _react2["default"].createElement('td', null)
	            ));
	          }
	          break;
	        case 2:
	          j = 0;
	          for (var _i = 0; _i < end; _i++) {
	            teachers = [];
	            all_lists[_i].teacher.map(function (e) {
	              teachers.push(_react2["default"].createElement(
	                'span',
	                { key: j++ },
	                e.xm
	              ));
	            });

	            lists.push(_react2["default"].createElement(
	              'tr',
	              { key: _i },
	              _react2["default"].createElement('td', null),
	              _react2["default"].createElement(
	                'td',
	                null,
	                _i + 1 + _count * (this.props.page - 1)
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i].kcbh
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i].kcmc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i].fzrxm
	              ),
	              _react2["default"].createElement(
	                'td',
	                { className: 'out-teacher' },
	                _react2["default"].createElement(
	                  'div',
	                  { className: 'teachers' },
	                  teachers
	                )
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                _react2["default"].createElement(
	                  'a',
	                  { href: '#', onClick: this.option.bind(this, {
	                      Teachers: all_lists[_i].teacher,
	                      Master: all_lists[_i].fzrxm ? { xm: all_lists[_i].fzrxm, sfrzh: all_lists[_i].fzrsfrzh } : '',
	                      Kcbh: all_lists[_i].kcbh,
	                      Kcmc: all_lists[_i].kcmc
	                    }) },
	                  '\u7F16\u8F91'
	                )
	              ),
	              _react2["default"].createElement('td', null)
	            ));
	          }
	          break;
	        case 3:
	          j = 0;
	          //过滤掉重复的教师信息
	          for (var _i2 = 0; _i2 < end; _i2++) {
	            teachers = [];
	            if (all_lists[_i2].teacher) {
	              all_lists[_i2].teacher.map(function (e) {
	                teachers.push(_react2["default"].createElement(
	                  'span',
	                  { key: j++ },
	                  e.xm
	                ));
	              });
	            } else {
	              teachers = [];
	            }
	            lists.push(_react2["default"].createElement(
	              'tr',
	              { key: _i2 },
	              _react2["default"].createElement('td', null),
	              _react2["default"].createElement(
	                'td',
	                null,
	                _i2 + 1 + _count * (this.props.page - 1)
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i2].kcbh
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i2].kcmc
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                all_lists[_i2].fzrxm
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                teachers
	              ),
	              _react2["default"].createElement(
	                'td',
	                null,
	                _react2["default"].createElement(
	                  'a',
	                  { href: '#', onClick: this.option.bind(this, {
	                      Teachers: all_lists[_i2].teacher,
	                      Kcbh: all_lists[_i2].kcbh,
	                      Kcmc: all_lists[_i2].kcmc
	                    }) },
	                  '\u7F16\u8F91'
	                )
	              ),
	              _react2["default"].createElement('td', null)
	            ));
	            teachers = [];
	          }
	          break;
	      }
	      return lists;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'tbody',
	        null,
	        this.create_list(this.props.Lists)
	      );
	    }
	  }]);

	  return BlueMUI_CreateTbody;
	}(_react2["default"].Component);

	//创建弹出层层


	var BlueMUI_CreatePopup = function (_React$Component3) {
	  _inherits(BlueMUI_CreatePopup, _React$Component3);

	  function BlueMUI_CreatePopup(props) {
	    _classCallCheck(this, BlueMUI_CreatePopup);

	    var _this4 = _possibleConstructorReturn(this, (BlueMUI_CreatePopup.__proto__ || Object.getPrototypeOf(BlueMUI_CreatePopup)).call(this, props));

	    _this4.shuld_insert = true;
	    _this4.popup_serch = _this4.popup_serch.bind(_this4);
	    _this4.popup = document.getElementById('popup');
	    _this4.choose_teachers = [];
	    _this4.serch_name = "";
	    _this4.teacher_names = {};
	    _this4.Master = "";
	    _this4.xueyuan_name = '';
	    //用于搜索用的state
	    _this4.state = {
	      teachers: [],
	      total: 0,
	      page: 1,
	      pages: 0
	    };
	    return _this4;
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
	          this.props.Title
	        ),
	        _react2["default"].createElement(
	          'span',
	          { id: 'popup_close', ref: 'close' },
	          'X'
	        )
	      );
	    }
	  }, {
	    key: 'insert_xueyuan',
	    value: function insert_xueyuan() {
	      var _this5 = this;

	      if (!this.shuld_insert) {
	        return;
	      } else {
	        this.shuld_insert = false;
	      }
	      ajax({
	        url: courseCenter.host + 'getCollege',
	        data: {
	          unifyCode: getCookie("userId")
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (datas.meta.result == 100) {
	            var CL = '<option value="">请选择</option>';
	            datas.data.map(function (e) {
	              return CL += '<option value=' + e.kkxymc + '>' + e.kkxymc + '</option>';
	            });
	            _this5.xueyuan.innerHTML = CL;
	          }
	        }
	      });
	    }
	  }, {
	    key: 'create_popup_serch',
	    value: function create_popup_serch() {
	      var _this6 = this;

	      return _react2["default"].createElement(
	        'div',
	        { id: 'serch' },
	        _react2["default"].createElement(
	          'span',
	          { id: 'xueyuan_span' },
	          '\u5B66\u9662\uFF1A'
	        ),
	        _react2["default"].createElement(
	          'select',
	          {
	            name: 'xueyuan',
	            id: 'xueyuan',
	            ref: function ref(select) {
	              (_this6.xueyuan = select) ? _this6.insert_xueyuan() : '';
	            }
	          },
	          _react2["default"].createElement(
	            'option',
	            { value: '' },
	            '\u8BF7\u9009\u62E9'
	          )
	        ),
	        _react2["default"].createElement(
	          'span',
	          { id: 'popup_left' },
	          '\u67E5\u627E\uFF08\u59D3\u540D\uFF09'
	        ),
	        _react2["default"].createElement('input', { type: 'text', id: 'popup_serch', placeholder: '\u8BF7\u8F93\u5165\u5173\u952E\u5B57\u2026\u2026', ref: 'serch_value' }),
	        _react2["default"].createElement(
	          'span',
	          { id: 'popup_serch_button', ref: 'serch' },
	          '\u641C \xA0\u7D22'
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
	          _react2["default"].createElement('td', { width: '34px' }),
	          _react2["default"].createElement(
	            'td',
	            { width: '45px', className: 'input' },
	            _react2["default"].createElement('input', { type: 'checkbox', ref: 'popup_allcheck' })
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '184px' },
	            '\u5355\u4F4D'
	          ),
	          _react2["default"].createElement(
	            'td',
	            { width: '130px' },
	            '\u59D3\u540D'
	          )
	        )
	      );
	    }
	  }, {
	    key: 'create_popup_tbody',
	    value: function create_popup_tbody() {
	      var lists = [];
	      var end = this.state.teachers.length;
	      for (var i = 0; i < end; i++) {
	        lists.push(_react2["default"].createElement(
	          'tr',
	          { key: this.state.teachers[i].sfrzh },
	          _react2["default"].createElement(
	            'td',
	            null,
	            i + 1 + 10 * (this.state.page - 1)
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            _react2["default"].createElement('input', { type: 'checkbox', value: JSON.stringify(this.state.teachers[i]), id: this.state.teachers[i].sfrzh })
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            this.state.teachers[i].xymc
	          ),
	          _react2["default"].createElement(
	            'td',
	            null,
	            this.state.teachers[i].xm
	          )
	        ));
	      }
	      return _react2["default"].createElement(
	        'tbody',
	        { ref: 'popup_tbody' },
	        lists
	      );
	    }
	  }, {
	    key: 'create_popup_option',
	    value: function create_popup_option() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'popup_option' },
	        _react2["default"].createElement(
	          'span',
	          { className: 'pop-opt-btn', id: 'popup_ok', ref: 'OK' },
	          '\u786E\u5B9A'
	        ),
	        _react2["default"].createElement(
	          'span',
	          { className: 'pop-opt-btn', id: 'popup_return', ref: 'back' },
	          '\u8FD4\u56DE'
	        )
	      );
	    }

	    //搜索

	  }, {
	    key: 'popup_serch',
	    value: function popup_serch(p, start) {
	      if (p == 0) {
	        return;
	      }
	      //每次发生ajax的时候清空候选数据与checkbox
	      this.refs.popup_allcheck.checked = false;
	      var inputs = this.refs.popup_tbody.getElementsByTagName('input');
	      this.Master = "";
	      this.teacher_names = {};
	      this.choose_teachers = [];

	      var end = inputs.length;
	      for (var i = 0; i < end; i++) {
	        inputs[i].checked = false;
	      }
	      var that = this;
	      ajax({
	        url: courseCenter.host + 'searchTeacherByName',
	        data: {
	          name: start || that.serch_name,
	          college: this.xueyuan_name,
	          page: p,
	          count: 10
	        },
	        success: function success(gets) {
	          var list = JSON.parse(gets);
	          if (list.data) {
	            that.setState({
	              teachers: list.data.teacherList,
	              pages: list.data.totalPages,
	              total: list.data.total,
	              page: p
	            });
	          } else {
	            that.setState({
	              teachers: [],
	              total: list.data.total,
	              page: 1,
	              pages: 0
	            });
	          }
	        }
	      });
	    }

	    //组件渲染完成后会执行的函数，可以在里面进行手动js事件绑定
	    //手动绑定可以避免react自己的事件绑定不能阻止冒泡的坑
	    //因为react的事件全部代理在document上面的

	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var that = this;
	      var hide_popup = function hide_popup(e) {
	        if (e.target.id === 'popup' || e.target.id === 'popup_return' || e.target.id === 'popup_close') {
	          that.popup.style.display = "none";
	          _reactDom2["default"].unmountComponentAtNode(document.getElementById('popup'));
	        }
	      };
	      //单击弹出窗后面的背景隐藏弹出层
	      this.popup.onclick = hide_popup;
	      //单击关闭按钮隐藏弹出层
	      this.refs.close.onclick = hide_popup;
	      //单击弹出窗的返回按钮隐藏弹出层
	      this.refs.back.onclick = hide_popup;
	      //阻止弹出窗body的单击事件冒泡
	      // document.getElementById('popup_body').onclick=function(e){
	      //   e.stopPropagation();
	      // };

	      //搜索按钮单击
	      this.refs.serch.onclick = function () {
	        that.serch_name = that.refs.serch_value.value;
	        that.xueyuan_name = that.xueyuan.value;
	        that.popup_serch(1);
	      };

	      //单击确定按钮
	      this.popup_serch(1, '');
	    }

	    //重新渲染后的执行内容

	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var that = this;

	      //单击确认
	      this.refs.OK.onclick = function () {
	        if (that.refs.popup_tbody.children.length > 0) {
	          //确认请求  //权限2的确认操作
	          if (that.props.Master) {
	            that.props.callback({ master: that.Master });
	          } else {
	            var Teachers = [];
	            if (that.props.Rank == 1) {
	              that.choose_teachers.map(function (e) {
	                Teachers.push({
	                  sfrzh: e,
	                  jyszr: that.teacher_names[e]
	                });
	              });
	            } else {
	              that.choose_teachers.map(function (e) {
	                Teachers.push({
	                  sfrzh: e,
	                  xm: that.teacher_names[e]
	                });
	              });
	            }
	            that.props.callback(Teachers);
	          }
	        }
	        //清空搜索栏
	        that.popup.style.display = "none";
	        _reactDom2["default"].unmountComponentAtNode(document.getElementById('popup'));
	      };

	      //全部打钩
	      var inputs = that.refs.popup_tbody.getElementsByTagName('input');
	      var end = inputs.length;
	      if (!this.props.Master) {
	        //不是权限 1或者权限 2的 Master
	        this.refs.popup_allcheck.onchange = function () {
	          for (var i = 0; i < end; i++) {
	            inputs[i].checked = this.checked;
	            inputs[i].onchange(0);
	          }
	        };
	      } else {
	        this.refs.popup_allcheck.style.display = 'none';
	      }

	      //单个打钩
	      for (var j = 0; j < end; j++) {
	        inputs[j].onchange = function (a) {
	          if (a) {
	            //取消“全部打钩”的钩
	            that.refs.popup_allcheck.checked = false;
	          }
	          if (that.props.Master) {
	            //权限 1进入
	            if (this.checked) {
	              that.Master = JSON.parse(this.value);
	              for (var k = 0; k < end; k++) {
	                inputs[k].checked = false;
	                this.checked = true;
	              }
	            } else {
	              that.Master = "";
	            }
	          } else {
	            //不是唯一设置的课程负责人
	            if (this.checked) {
	              that.choose_teachers.push(this.id);
	              that.teacher_names[this.id] = JSON.parse(this.value).xm;
	            } else {
	              var index = that.choose_teachers.indexOf(this.id);
	              if (index > -1) {
	                that.choose_teachers.splice(index, 1);
	              }
	              delete that.teacher_names[this.id];
	            }
	          }
	        };
	      }

	      //fanye
	      // let fanye_in=this.refs.fanye_in;
	      // if(fanye_in.refs.popup_fanye){
	      //   let fanye_bar=fanye_in.refs.popup_fanye.children;
	      //   let yema=fanye_bar.length;
	      //   for(let j=0;j<yema;j++) {
	      //     if(fanye_bar[j].innerText!='...') {
	      //       fanye_bar[j].onclick=e=>{
	      //         let click_page= +e.target.innerText;
	      //         that.popup_serch(click_page==this.state.page?0:click_page,that.serch_name||'');
	      //       }
	      //     }
	      //   }
	      // }

	      //搜索的前翻和后翻
	      // if(fanye_in.refs.next&&fanye_in.refs.pre) {
	      //   fanye_in.refs.next.onclick=function() {
	      //     that.popup_serch(that.state.page+1>that.state.pages?0:that.state.page+1,that.serch_name||'');
	      //   }
	      //   fanye_in.refs.pre.onclick=function() {
	      //     that.popup_serch(that.state.page-1<1?0:that.state.page-1,that.serch_name||'');
	      //   }
	      // }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.popup.style.display = "block";
	      return _react2["default"].createElement(
	        'div',
	        { id: 'popup_body' },
	        this.create_popup_top(),
	        this.create_popup_serch(),
	        _react2["default"].createElement(
	          'table',
	          { id: 'serch_table' },
	          this.create_popup_thead(),
	          this.create_popup_tbody()
	        ),
	        _react2["default"].createElement(BlueMUI_CreateFanye, {
	          id: 'Popup_Fanye',
	          TP: { pages: this.state.pages, page: this.state.page, total: this.state.total },
	          ref: 'fanye_out',
	          callback: this.popup_serch.bind(this)
	        }),
	        this.create_popup_option()
	      );
	    }
	  }]);

	  return BlueMUI_CreatePopup;
	}(_react2["default"].Component);

	// <BlueMUI_CreateFanye id="Popup_Fanye" page={this.state.page} pages={this.state.pages} ref="fanye_in" />


	var BlueMUI_CreateAdding = function (_React$Component4) {
	  _inherits(BlueMUI_CreateAdding, _React$Component4);

	  function BlueMUI_CreateAdding(props) {
	    _classCallCheck(this, BlueMUI_CreateAdding);

	    var _this7 = _possibleConstructorReturn(this, (BlueMUI_CreateAdding.__proto__ || Object.getPrototypeOf(BlueMUI_CreateAdding)).call(this, props));

	    _this7.del_teacher = _this7.del_teacher.bind(_this7);
	    _this7.save_adding = _this7.save_adding.bind(_this7);
	    _this7.back = _this7.back.bind(_this7);
	    _this7.create_tdjs = _this7.create_tdjs.bind(_this7);
	    _this7.state = {
	      teachers: _this7.props.Teachers || _this7.props.Leaders,
	      master: _this7.props.Master
	    };
	    return _this7;
	  }

	  _createClass(BlueMUI_CreateAdding, [{
	    key: 'del_teacher',
	    value: function del_teacher(a) {
	      var that = this;

	      if (typeof a == "number") {
	        var teacher_cache = this.state.teachers;
	        teacher_cache.splice(a, 1);
	        this.setState({ teachers: teacher_cache });
	      } else {
	        this.setState({ master: "" });
	      }
	    }
	  }, {
	    key: 'back',
	    value: function back() {
	      var that = this;
	      ajax({
	        url: courseCenter.host + 'CourseMatainMsg',
	        data: {
	          type: that.props.Rank,
	          unifyCode: BluMUI.result.user_id,
	          page: BluMUI.result.Title.state.page,
	          count: _count,
	          selectName: document.getElementById('jxtdss').value
	        },
	        success: function success(gets) {
	          document.getElementById('body_head').style.display = 'block';
	          var data = JSON.parse(gets);
	          BluMUI.create({
	            id: 'Title',
	            rank: that.props.Rank,
	            page: BluMUI.result.Title.state.page,
	            lists: data.data.courseList,
	            totalPages: data.data.totalPages
	          }, 'CreateTableTitle', document.getElementById('list'));
	        }
	      });
	    }
	  }, {
	    key: 'save_adding',
	    value: function save_adding() {
	      var that = this;

	      if (!this.state.master && this.props.Rank == 2) {
	        alert("请添加负责人！");
	        return;
	      }
	      if (this.props.Rank == 3) {
	        if (this.refs.Js.value === '') {
	          alert('请填写团队介绍！');
	          return;
	        }
	        var teacher_codes = "";
	        this.state.teachers.map(function (e) {
	          teacher_codes += e.sfrzh + ",";
	        });
	        //去掉字符串末尾的","
	        teacher_codes = teacher_codes.substring(0, teacher_codes.length - 1);
	        ajax({
	          url: courseCenter.host + 'updateTeachingTeam',
	          data: {
	            kcbh: that.props.Kcbh,
	            kcmc: that.props.Kcmc,
	            unifyCode: BluMUI.result.user_id,
	            unifyCodes: teacher_codes,
	            tdjs: document.getElementById('tdjs_text').value
	          },
	          success: function success(gets) {
	            if (JSON.parse(gets).meta.msg == 'success') {
	              ajax({
	                url: courseCenter.host + 'CourseMatainMsg',
	                data: {
	                  type: 3,
	                  unifyCode: BluMUI.result.user_id,
	                  page: BluMUI.result.Title.state.page,
	                  count: _count,
	                  selectName: document.getElementById('jxtdss').value
	                },
	                success: function success(gets) {
	                  document.getElementById('body_head').style.display = 'block';
	                  var data = JSON.parse(gets);
	                  BluMUI.create({
	                    id: 'Title',
	                    rank: 3,
	                    page: BluMUI.result.Title.state.page,
	                    lists: data.data.courseList,
	                    totalPages: data.data.totalPages
	                  }, 'CreateTableTitle', document.getElementById('list'));
	                }
	              });
	            }
	          }
	        });
	      } else if (this.props.Rank == 2) {
	        var _teacher_codes = "";
	        this.state.teachers.map(function (e) {
	          _teacher_codes += e.sfrzh + ",";
	        });
	        //去掉字符串末尾的","
	        _teacher_codes = _teacher_codes.substring(0, _teacher_codes.length - 1);
	        ajax({
	          url: courseCenter.host + 'updateCoursePrincipal',
	          data: {
	            kcbh: that.props.Kcbh,
	            kcmc: that.props.Kcmc,
	            unifyCode: BluMUI.result.user_id,
	            unifyCodes: _teacher_codes,
	            principalUnifyCode: that.state.master.sfrzh
	          },
	          success: function success(gets) {
	            if (JSON.parse(gets).meta.msg == 'success') {
	              ajax({
	                url: courseCenter.host + 'CourseMatainMsg',
	                data: {
	                  type: 2,
	                  unifyCode: BluMUI.result.user_id,
	                  page: BluMUI.result.Title.state.page,
	                  count: _count,
	                  selectName: document.getElementById('jxtdss').value
	                },
	                success: function success(gets) {
	                  document.getElementById('body_head').style.display = 'block';
	                  var data = JSON.parse(gets);
	                  BluMUI.create({
	                    id: 'Title',
	                    rank: 2,
	                    page: BluMUI.result.Title.state.page,
	                    lists: data.data.courseList,
	                    totalPages: data.data.totalPages
	                  }, 'CreateTableTitle', document.getElementById('list'));
	                }
	              });
	            }
	          }
	        });
	      } else if (this.props.Rank == 1) {
	        var _teacher_codes2 = "";
	        this.state.teachers.map(function (e) {
	          _teacher_codes2 += e.sfrzh + ",";
	        });
	        //去掉字符串末尾的","
	        _teacher_codes2 = _teacher_codes2.substring(0, _teacher_codes2.length - 1);
	        ajax({
	          url: courseCenter.host + 'updateTeachingOfficeLeader',
	          data: {
	            jysh: this.props.Jysh,
	            unifyCode: BluMUI.result.user_id,
	            leaderUnifyCode: _teacher_codes2
	          },
	          success: function success(gets) {
	            if (JSON.parse(gets).meta.msg == 'success') {
	              ajax({
	                url: courseCenter.host + 'CourseMatainMsg',
	                data: {
	                  type: 1,
	                  unifyCode: BluMUI.result.user_id,
	                  page: BluMUI.result.Title.state.page,
	                  count: _count,
	                  selectName: document.getElementById('jxtdss').value
	                },
	                success: function success(gets) {
	                  document.getElementById('body_head').style.display = 'block';
	                  var data = JSON.parse(gets);
	                  BluMUI.create({
	                    id: 'Title',
	                    rank: 1,
	                    page: BluMUI.result.Title.state.page,
	                    lists: data.data.courseList,
	                    totalPages: data.data.totalPages
	                  }, 'CreateTableTitle', document.getElementById('list'));
	                }
	              });
	            }
	          }
	        });
	      }
	    }
	    // <img src="../../imgs/public/red_star.png" />

	  }, {
	    key: 'create_fuzeren',
	    value: function create_fuzeren() {
	      var fuzeren = void 0;
	      var mst = void 0;

	      if (this.props.Rank == 2) {
	        if (this.state.master.xm) {
	          mst = _react2["default"].createElement(
	            'div',
	            { id: 'master' },
	            this.state.master && _react2["default"].createElement(
	              'span',
	              { className: 'green_btn', key: this.state.master.sfrzh },
	              this.state.master.xm,
	              _react2["default"].createElement(
	                'div',
	                { className: 'dt' },
	                _react2["default"].createElement('img', { src: '../../imgs/public/teacher_del.png', onClick: this.del_teacher })
	              )
	            )
	          );
	        }
	        fuzeren = _react2["default"].createElement(
	          'div',
	          { id: 'fuzeren' },
	          _react2["default"].createElement(
	            'div',
	            { className: 'list_left' },
	            _react2["default"].createElement(
	              'span',
	              { style: { color: 'red' } },
	              '*'
	            ),
	            _react2["default"].createElement(
	              'span',
	              null,
	              '\u8BFE\u7A0B\u8D1F\u8D23\u4EBA'
	            )
	          ),
	          _react2["default"].createElement(
	            'div',
	            { className: 'list_right' },
	            _react2["default"].createElement(
	              'span',
	              { className: 'add_btn', ref: 'adding_fuzeren' },
	              (this.state.master.xm ? "修改" : "添加") + "负责人"
	            ),
	            mst
	          )
	        );
	      } else {
	        fuzeren = null;
	      }
	      return fuzeren;
	    }
	  }, {
	    key: 'create_adding_left',
	    value: function create_adding_left() {
	      var leader = _react2["default"].createElement(
	        'span',
	        null,
	        _react2["default"].createElement(
	          'span',
	          { style: { color: 'red', position: 'relative', top: '2px' } },
	          '*\xA0'
	        ),
	        '\u7CFB\u90E8\u4E2D\u5FC3\u4E3B\u4EFB'
	      );
	      var jiaoshi = _react2["default"].createElement(
	        'span',
	        null,
	        '\u4EFB\u8BFE\u6559\u5E08'
	      );
	      return _react2["default"].createElement(
	        'div',
	        { className: 'list_left' },
	        _react2["default"].createElement(
	          'span',
	          null,
	          this.props.Rank == 1 ? leader : jiaoshi
	        )
	      );
	    }
	  }, {
	    key: 'create_adding_right',
	    value: function create_adding_right() {
	      var teachers = [];
	      var end = this.state.teachers.length;
	      for (var i = 0; i < end; i++) {
	        teachers.push(_react2["default"].createElement(
	          'span',
	          { className: 'green_btn', key: this.state.teachers[i].sfrzh },
	          this.props.Rank == 1 ? this.state.teachers[i].jyszr : this.state.teachers[i].xm,
	          _react2["default"].createElement(
	            'div',
	            { className: 'dt' },
	            _react2["default"].createElement('img', { src: '../../imgs/public/teacher_del.png', onClick: this.del_teacher.bind(this, i) })
	          )
	        ));
	      }

	      return _react2["default"].createElement(
	        'div',
	        { className: 'list_right' },
	        _react2["default"].createElement(
	          'span',
	          { className: 'add_btn', ref: 'adding_teachers' },
	          this.props.Rank == 1 ? '添加系部中心主任' : '添加任课教师'
	        ),
	        _react2["default"].createElement(
	          'div',
	          { id: 'teachers' },
	          teachers
	        )
	      );
	    }
	  }, {
	    key: 'create_tdjs',
	    value: function create_tdjs() {
	      if (this.props.Rank != 3) return;
	      return _react2["default"].createElement(
	        'div',
	        { id: 'tdjs' },
	        _react2["default"].createElement(
	          'span',
	          { style: { color: 'red' } },
	          '*'
	        ),
	        _react2["default"].createElement(
	          'span',
	          { style: { marginLeft: 5 } },
	          '\u56E2\u961F\u4ECB\u7ECD'
	        ),
	        _react2["default"].createElement('textarea', { name: 'TDJS', id: 'tdjs_text', cols: '30', rows: '10', ref: 'Js' }),
	        _react2["default"].createElement('span', { id: 'Js_warn', ref: 'Js_warn', style: { color: 'red' } })
	      );
	    }

	    //组件第一次渲染后执行的内容

	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this8 = this;

	      // document.getElementById('list').style.minHeight="738px";
	      if (this.props.Rank == 3) {
	        ajax({
	          url: courseCenter.host + 'getTeachingTeamPageMsg',
	          data: {
	            kcbh: this.props.Kcbh,
	            unifyCode: BluMUI.result.user_id
	          },
	          success: function success(gets) {
	            document.getElementById('tdjs_text').value = JSON.parse(gets).data.tdjs;
	          }
	        });
	      }
	      var that = this;

	      var change = function change(dat) {
	        that.setState(dat);
	      };
	      var add_teacher = function add_teacher(tea) {
	        var newTeachers = that.state.teachers.concat(tea);
	        var result = [];
	        for (var i = 0; i < newTeachers.length; i++) {
	          var flag = 0;
	          for (var j = 0; j < result.length; j++) {
	            if (newTeachers[i].sfrzh == result[j].sfrzh) {
	              flag++;
	            }
	          }
	          if (flag == 0) {
	            result.push(newTeachers[i]);
	          }
	        }
	        that.setState({ teachers: result });
	      };

	      if (this.refs.adding_fuzeren) {
	        //存在按钮的时候才能绑定事件
	        this.refs.adding_fuzeren.onclick = function () {
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreatePopup, { Rank: that.props.Rank, Master: true, Title: '\u9009\u62E9\u6559\u5E08', callback: change }), document.getElementById('popup'));
	        };
	      }

	      this.refs.adding_teachers.onclick = function () {
	        if (that.props.Rank == 1) {
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreatePopup, { Rank: that.props.Rank, Master: false, Title: '\u9009\u62E9\u7CFB\u90E8\u4E2D\u5FC3\u4E3B\u4EFB', callback: add_teacher }), document.getElementById('popup'));
	        } else {
	          _reactDom2["default"].render(_react2["default"].createElement(BlueMUI_CreatePopup, { Rank: that.props.Rank, Master: false, Title: '\u9009\u62E9\u6559\u5E08', callback: add_teacher }), document.getElementById('popup'));
	        }
	      };
	      if (this.props.Rank == 3) {
	        this.refs.Js.onchange = function (e) {
	          if (e.target.value === '') {
	            _this8.refs.Js_warn.innerText = '请输入团队介绍！';
	          } else {
	            _this8.refs.Js_warn.innerText = '';
	          }
	        };
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2["default"].createElement(
	        'div',
	        { id: 'adding' },
	        this.create_tdjs(),
	        this.create_fuzeren(),
	        _react2["default"].createElement(
	          'div',
	          { id: 'down' },
	          this.create_adding_left(),
	          this.create_adding_right()
	        ),
	        _react2["default"].createElement(
	          'div',
	          { id: 'opt' },
	          _react2["default"].createElement(
	            'span',
	            { className: 'caozuo', id: 'Adding_baocun', ref: 'save_adding', onClick: this.save_adding },
	            '\u4FDD\u5B58'
	          ),
	          _react2["default"].createElement(
	            'span',
	            { className: 'caozuo', id: 'Adding_fanhui', ref: 'back', onClick: this.back },
	            '\u8FD4\u56DE'
	          )
	        )
	      );
	    }
	  }]);

	  return BlueMUI_CreateAdding;
	}(_react2["default"].Component);

	// class BlueMUI_CreateFanye extends React.Component {
	//   constructor(props) {
	//     super(props);
	//   }

	//   create_popup_fanye() {
	//     let style={};
	//     let fanye=[];
	//     let start=1;
	//     let end=this.props.pages;
	//     let style_on={
	//       background:"url('../../imgs/courseAudit/fanye_bg.png')",
	//       backgroundRepeat:'no-repeat',
	//       backgroundPosition:'5px 5px',
	//       color:'#FFF'
	//     };
	//     if(this.props.pages==0) {
	//       return <div></div>;
	//     }
	//     if(this.props.pages<=7) {
	//       for(let i=2;i<this.props.pages;i++) {
	//         if(i==this.props.page) {
	//           style=style_on;
	//         } else {
	//           style={};
	//         }
	//         fanye.push(<li key={i} style={style}>{i}</li>);
	//       }
	//     } else {
	//       if(this.props.page<5) {
	//         for(let j=2;j<=6;j++) {
	//           if(j==this.props.page) {
	//             style=style_on;
	//           } else {
	//             style={};
	//           }
	//           fanye.push(<li key={j} style={style}>{j}</li>);
	//         }
	//         fanye.push(<li key='end' >...</li>);
	//       } else if(this.props.page>this.props.pages-4) {
	//         for(let k=this.props.pages-5;k<this.props.pages;k++) {
	//           if(k==this.props.page) {
	//             style=style_on;
	//           } else {
	//             style={};
	//           }
	//           fanye.push(<li key={k} style={style}>{k}</li>);
	//         }
	//         fanye.unshift(<li key='start' >...</li>);
	//       } else {
	//         for(let l=this.props.page-2;l<=this.props.page+2; l++) {
	//           if(l==this.props.page) {
	//             style=style_on;
	//           } else {
	//             style={};
	//           }
	//           fanye.push(<li key={l} style={style}>{l}</li>);
	//         }
	//         fanye.unshift(<li key='start' >...</li>);
	//         fanye.push(<li key='end' >...</li>);
	//       }
	//     }
	//     if(this.props.page==1) {
	//       if(this.props.pages==1) {
	//         fanye=[<li key={1} style={style_on} >{1}</li>];
	//       } else {
	//         fanye.unshift(<li key={1} style={style_on} >{1}</li>);
	//         fanye.push(<li key={this.props.pages}>{this.props.pages}</li>);
	//       }
	//     } else if(this.props.page==this.props.pages) {
	//       fanye.unshift(<li key={1}>{1}</li>);
	//       fanye.push(<li key={this.props.pages} style={style_on} >{this.props.pages}</li>);
	//     } else {
	//       fanye.unshift(<li key={1}>{1}</li>);
	//       fanye.push(<li key={this.props.pages}>{this.props.pages}</li>);
	//     }
	//     return(<div className="fanye" id={this.props.id}>
	//       <div className="popup_fanye_pre" ref="pre"><img src="../../imgs/courseAudit/fanye_left.png"/></div>
	//       <ul ref="popup_fanye">
	//         {fanye}
	//       </ul>
	//       <div className="popup_fanye_next" ref="next"><img src="../../imgs/courseAudit/fanye_right.png"/></div>
	//     </div>);
	//   }

	//   render() {
	//     return this.create_popup_fanye();
	//   }

	// }

	var BlueMUI_CreateFanye = function (_React$Component5) {
	  _inherits(BlueMUI_CreateFanye, _React$Component5);

	  function BlueMUI_CreateFanye(props) {
	    _classCallCheck(this, BlueMUI_CreateFanye);

	    return _possibleConstructorReturn(this, (BlueMUI_CreateFanye.__proto__ || Object.getPrototypeOf(BlueMUI_CreateFanye)).call(this, props));
	  }

	  _createClass(BlueMUI_CreateFanye, [{
	    key: 'create_popup_fanye',
	    value: function create_popup_fanye() {
	      var _this10 = this;

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
	            { key: p, onClick: _this10.fanye.bind(_this10, p) },
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
	          for (var _i3 = 1; _i3 <= 5; _i3++) {
	            change_page(_i3);
	          }
	        } else if (now > end - 3) {
	          for (var _i4 = end - 4; _i4 <= end; _i4++) {
	            change_page(_i4);
	          }
	        } else {
	          for (var _i5 = now - 2; _i5 <= now + 2; _i5++) {
	            change_page(_i5);
	          }
	        }
	      }

	      return _react2["default"].createElement(
	        'div',
	        { className: 'fanye', id: this.props.id },
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
	      if (!this.refs.tp || !this.props.callback) {
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
	      var _this11 = this;

	      if (!this.refs.tp) {
	        return;
	      }
	      // 手动跳转翻页
	      this.refs.tp.onkeydown = function (eve) {
	        if (eve.keyCode === 13) {
	          var newpage = +eve.target.value;
	          if (!isNaN(newpage)) {
	            if (newpage >= 1 && newpage <= _this11.props.TP.pages) {
	              _this11.fanye(newpage);
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
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      var _this12 = this;

	      if (!this.refs.tp) {
	        return;
	      }

	      // 手动跳转翻页
	      this.refs.tp.onkeydown = function (eve) {
	        if (eve.keyCode === 13) {
	          var newpage = +eve.target.value;
	          if (!isNaN(newpage)) {
	            if (newpage >= 1 && newpage <= _this12.props.TP.pages) {
	              _this12.fanye(newpage);
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

	  return BlueMUI_CreateFanye;
	}(_react2["default"].Component);
	//tab标签


	var BlueMUI_CreateTab = function (_React$Component6) {
	  _inherits(BlueMUI_CreateTab, _React$Component6);

	  function BlueMUI_CreateTab(props) {
	    _classCallCheck(this, BlueMUI_CreateTab);

	    var _this13 = _possibleConstructorReturn(this, (BlueMUI_CreateTab.__proto__ || Object.getPrototypeOf(BlueMUI_CreateTab)).call(this, props));

	    _this13.state = {
	      Rank: +_this13.props.role[0].subModule
	    };
	    _this13.show_list = _this13.show_list.bind(_this13);
	    return _this13;
	  }

	  _createClass(BlueMUI_CreateTab, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this14 = this;

	      //改变第一个tab标签的字体为粗体
	      this.refs['Rank-' + this.state.Rank].style.color = '#009361';
	      var that = this;

	      var _loop = function _loop(i) {
	        _this14.refs['Rank-' + _this14.props.role[i].subModule].onclick = function (e) {
	          document.getElementById('jxtdss').value = '';
	          that.setState({ Rank: +that.props.role[i].subModule }, tab_change);
	        };
	      };

	      for (var i = 0; i < this.props.role.length; i++) {
	        _loop(i);
	      }

	      var tab_change = function tab_change() {
	        that.props.role.map(function (e) {
	          that.refs['Rank-' + e.subModule].style.color = '#999999';
	        });
	        that.refs['Rank-' + that.state.Rank].style.color = '#009361';
	      };

	      /*绑定搜素*/
	      document.getElementById('serch_btn').onclick = SERCH;
	      document.getElementById('jxtdss').onkeydown = function (e) {
	        if (e.keyCode == 13) SERCH();
	      };
	      function SERCH() {
	        ajax({
	          url: courseCenter.host + 'CourseMatainMsg',
	          data: {
	            page: 1,
	            count: _count,
	            type: that.state.Rank,
	            unifyCode: BluMUI.result.user_id,
	            selectName: document.getElementById('jxtdss').value
	          },
	          success: function success(get) {
	            var datas = JSON.parse(get);
	            BluMUI.result.Title.setState({
	              lists: datas.data.courseList,
	              page: 1,
	              total: datas.data.total,
	              totalPages: datas.data.totalPages
	            });
	          }
	        });
	      }
	    }
	  }, {
	    key: 'show_list',
	    value: function show_list() {
	      var that = this;
	      ajax({
	        url: courseCenter.host + 'CourseMatainMsg',
	        data: {
	          type: that.state.Rank,
	          unifyCode: BluMUI.result.user_id,
	          page: 1,
	          count: _count,
	          selectName: document.getElementById('jxtdss').value
	        },
	        success: function success(gets) {
	          var datas = JSON.parse(gets);
	          if (!BluMUI.result.Title) {
	            BluMUI.create({
	              id: 'Title',
	              rank: that.state.Rank,
	              lists: datas.data.courseList,
	              page: 1,
	              total: datas.data.total,
	              totalPages: datas.data.totalPages
	            }, 'CreateTableTitle', document.getElementById('list'));
	          } else {
	            BluMUI.result.Title.setState({
	              rank: that.state.Rank,
	              lists: datas.data.courseList,
	              page: 1,
	              total: datas.data.total,
	              totalPages: datas.data.totalPages
	            });
	          }
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.state.Rank == 1) {
	        document.getElementById('serch_title').innerText = '系部中心名称';
	        document.getElementById('jxtdss').placeholder = '请输入系部中心名称';
	      } else {
	        document.getElementById('serch_title').innerText = '课程名称';
	        document.getElementById('jxtdss').placeholder = '请输入课程名称';
	      }
	      var tabs = [];
	      this.props.role.map(function (e) {
	        tabs.push(_react2["default"].createElement(
	          'li',
	          { key: e.cdxh, ref: 'Rank-' + e.subModule },
	          e.cdmc
	        ));
	        tabs.push(_react2["default"].createElement('li', { key: 'line-' + e.cdxh, className: 'center_line' }));
	      });
	      tabs.pop();
	      this.show_list();
	      return _react2["default"].createElement(
	        'ul',
	        { ref: 'tab' },
	        tabs
	      );
	    }
	  }]);

	  return BlueMUI_CreateTab;
	}(_react2["default"].Component);

	var BluMUI_M = {
	  CreateTableTitle: BlueMUI_CreateThead,
	  CreateTableBody: BlueMUI_CreateTbody,
	  CreateTab: BlueMUI_CreateTab
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