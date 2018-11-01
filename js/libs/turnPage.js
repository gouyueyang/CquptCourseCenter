import React from 'react';

export default class Fanye extends React.Component {
  constructor(props) {
    super(props);
  }

  create_popup_fanye() {
    let nums = [];
    let start = 1;
    let end = this.props.options.pages || 1;
    let now = this.props.options.page || 1;
    let page_on = { color: "#007A51" };

    let change_page = (p) => {
      if (p === now) {
        nums.push(<li key={p} style={page_on}>{p}</li>);
      } else {
        nums.push(<li key={p} onClick={this.fanye.bind(this, p)}>{p}</li>);
      }
    }

    if (end < 1) {
      nums.push(<li key="only" onClick={this.fanye.bind(this, 1)}>1</li>)
    } else if (end <= 5) {
      for (let i = 1; i <= end; i++) {
        change_page(i)
      }
    } else {
      if (now < 3) {
        for (let i = 1; i <= 5; i++) {
          change_page(i)
        }
      } else if (now > end - 3) {
        for (let i = end - 5; i <= end; i++) {
          change_page(i)
        }
      } else {
        for (let i = now - 2; i <= now + 2; i++) {
          change_page(i)
        }
      }
    }

    return (<div className="fanye">
      <span id="rows">共{this.props.options.rows >= 0 ? this.props.options.rows : 0}条记录</span>
      <input className="fanye_options" type="button" value="首页" id="fanye_start" onClick={this.fanye.bind(this, 1)} />
      <input className="fanye_options" type="button" value="上一页" id="fanye_pre" onClick={this.fanye.bind(this, now === 1 ? 0 : now - 1)} />
      <ul id="fanye_nums">{nums}</ul>
      <input type="text" id="tp" ref="tp" placeholder={`${this.props.options.page}/${this.props.options.pages}`} />
      <input className="fanye_options" type="button" value="下一页" id="fanye_next" onClick={this.fanye.bind(this, now === end ? 0 : now + 1)} />
      <input className="fanye_options" type="button" value="尾页" id="fanye_end" onClick={this.fanye.bind(this, end)} />
    </div>);
  }

  //翻页函数
  fanye(p) {
    this.refs.tp.value = null;
    if (p <= 0 || p > this.props.options.pages) {
      alert("输入页数不合格！");
      return;
    }
    this.props.callback(p);
  }

  render() {
    return this.create_popup_fanye();
  }

  componentDidMount() {
    // 手动跳转翻页
    this.refs.tp.onkeydown = (eve) => {
      if (eve.keyCode === 13) {
        if (!isNaN(+eve.target.value)) {
          this.fanye(+eve.target.value);
        } else {
          eve.target.value = null;
          eve.target.blur();
        }
      }
    }
  }
}