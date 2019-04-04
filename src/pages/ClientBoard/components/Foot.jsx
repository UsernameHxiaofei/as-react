import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
const Root = styled.div`
  > * {
    margin: 0 auto;
  }
  .foot {
    height: 40px;
    background-color: #e4e4e4;
    margin-top: 10px;
    font-size: 20px;
    line-height: 40px;
    direction: ltr;
    behavior: scroll;
    loop: 3;
    scrollamount: 1;
    scrolldelay: 10;
  }
`;
class Footer extends Component {
  render() {
    return (
      <Root>
        <marquee className='foot'>购卡享更多优惠,详情请咨询服务顾问!</marquee>
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
)(Footer);
