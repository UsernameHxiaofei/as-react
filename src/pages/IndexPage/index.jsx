import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { dispatch } from '@/store';
const Root = styled.div`
  padding-top: 40px;
  padding:0
`;

class IndexPage extends Component {
constructor(props) {
	 	super(props);
	 	this.state = {
	 		id:''
	 	};
	}
  render() {
    return (
      <Root>
        <div>
      		加载中
      	</div>
      </Root>
    );
  }
}

export default IndexPage