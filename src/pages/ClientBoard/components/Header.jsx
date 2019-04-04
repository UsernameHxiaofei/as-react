import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
const Root = styled.div`
  > * {
    margin: 0 auto;
  }
  .header {
    height: 40px;
    position: relative;
    clear: both;
    line-height: 40px;
    background-color: #e4e4e4;
    margin-bottom: 10px;
  }
  .headerLeft {
    position: absolute;
    left: 0;
    font-size: 20px;
  }
  .headerRight {
    position: absolute;
    right: 10px;
  }
  .weekday {
    padding-left: 10px;
  }
  .button {
    padding-left: 10px;
    color: #3385fe;
  }
`;
class Header extends Component {
  render() {
    return (
      <Root>
        <div className='header'>
          <div className='headerLeft'>七宝英菲尼迪欢迎您</div>
          <div className='headerRight'>
            <span>当前时间:2019年1月3日10:36</span>
            <span className='weekday'>星期四</span>
            <span className='button'>投屏</span>
            <span className='button'>设置</span>
          </div>
          
        </div>
      </Root>
    );
  }
}
const mapStateToProps = state => {
  const {} = state.ClientBoard;
  return {};
};

const mapDispatchToProps = dispatch => {
  const {} = dispatch.ClientBoard;
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
