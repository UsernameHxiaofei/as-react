//基础模块
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//第三方模块
import { fromJS, is } from 'immutable';
import styled from 'styled-components';

//UI组件
import {  } from 'antd';

//公共组件
import  from '@/components';

//组件
import  from '';

//样式
import './style/';


class moban extends Component {
  static propTypes = {
    string: PropTypes.string,
    number: PropTypes.number,
    bool: PropTypes.bool,
    array: PropTypes.array,
    object: PropTypes.object,
    func:  PropTypes.func,
    isRequired: PropTypes.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
  };

  constructor (props) {
    super(props);
    this.state = {};
  };

  componentWillMount () {

  };

  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
  };

  render () {
    return (
      <div className={ ('moban ' + className).trim() } style={ style }>
        
      </div>
    );
  };
};

export default moban;