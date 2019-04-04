//基础模块
import React, { PureComponent } from 'react';

//第三方模块
import { fromJS, is } from 'immutable';


class moban extends PurComponent {
  constructor (props) {
    super(props);
    this.state = {};
  };

  componentWillMount () {
    //组件初始化时只调用，此时可以修改 state。
  };

  componentDidMount () {
    //组件渲染之后调用，Dom已渲染完毕，可以调用 refs。
  };

  componentWillReceiveProps (nextProps) {
    //组件初始化时不调用，组件接受新的props时调用。
  };

  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
  };

  componentWillUpdate (nextProps, nextState) {
    //该生命周期不可调setState，否则会递归卡死。
  };

  componentDidUpdate (nextProps, nextState) {
    //组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
  };

  componentWillUnmount () {
    //组件将要卸载时调用，一些事件监听和定时器需要在此时清除。
  };

  render () {
    return ();
  };
};

export default moban;