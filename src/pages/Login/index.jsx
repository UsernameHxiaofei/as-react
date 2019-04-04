import React, { Component } from 'react';
import styled from 'styled-components';
import { dispatch } from '@/store';
import { Table, Icon, Divider, Select, Button, Modal, Input, Spin, message} from 'antd';
import {logOn, logOut, LogOnAfterOrg} from '../../services/getData'
import logo from '@/static/images/DSC.png'
import loginBcg from '@/static/images/login_bcg.png'
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

const Root = styled.div`
  > * {
    margin: 8px 0;
  }
  .login_header {
		padding: 0rem 0 0rem 12rem;
		display: flex;
		align-items: center;
		img {
			width: 5rem;
    		margin-right: 1rem;
		}
		p {
			display: inline-block;
		    font-weight: bold;
		    font-size: 1.5rem;
		}
	}
	
	.login_wrap {
		position: relative;
		top: 8rem;
		left: 25rem;
		margin: 0 auto;
		width: 23rem;
		height: 25rem;
		background-color: #fff;
		.login_content {
			font-size: 1.5rem;
			text-align: center;
		}
		.login_form {
			padding: 2rem 3rem;
			height: 100%;
			margin: 0 auto;
			.login_style {
				width: 100%;
				margin-bottom: 3rem;
				text-align: center;
				strong {
					font-weight: normal;
				}
			}
			.login_text {
				width: 100%;
				text-align: center;
				border: 1px solid #cbcbcb;
				border-radius: .4rem;
				margin-bottom: 1rem;
			}
			input {
				width: 70%;
				border: none;
				border-radius: .3rem;
				padding: 1rem;
			}
			input:focus {
				outline: none;
			}
			i {
				font-size: 1.5rem;
				vertical-align: middle;
			}
			.login_botton {
				width: 100%;
				text-align: center;
				margin-top: 2rem;
				input {
					width: 100%;
					border: none;
					border-radius: .5rem;
					background-color: #ff571a;
					color: #fff;
					font-size: 1.4rem;
					box-shadow: 0 0 10px #9a9a9a;
					cursor: pointer;
					padding: .6rem;
				}
			}
		}
	}
	.login_foot{
		position: fixed;
	    bottom: 0;
	    width: 100%;
	    text-align: center;
	    font-size: .6rem;
	    color: #ccc;
	    hr{
	    	background-color: #ccc;
	    	height: 1px;
	    	border: 0;
	    }
	}
`;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;

class Login extends Component {
	 constructor(props) {
	 	super(props);
	 	
	 	this.state = {
	 		data:{
	 			userName:'',
	 			password:'',
	 		}
	 	};
	 }
	componentWillMount() {
	}
	login = () =>{
		let data = this.state.data
			logOn(data).then(res=>{
				console.log(res,"登录")
				if(res.success){
					if(res.data.index=='0'){
						let str = JSON.stringify(res.data.indexResVo);
						let _info = {
							login:res.data.indexUserInfoVo,
							token:res.data.token
						}
						let info = JSON.stringify(_info);
						localStorage.data = str;
						localStorage.token=res.data.token
						localStorage.loginInfo = info
						localStorage.userNickName = res.data.indexUserInfoVo.userNickName
						//this.props.history.push('/')
						this.props.history.push({pathname:'/',state:{type:'login'}})
					}else if(res.data.index=='1'){
						
					}
					localStorage.token = res.data.token
					
					
				}else{
					Modal.error({
							title: res.msg,
						});
				}
			})
	}
	loginStore = () => {
		
	}
	loginChange = (type,e) => {
		let data = this.state.data
		this.setState({
		  data:Object.assign({}, data, {[type]:e.target.value})
		});
	}
	
	render() {
		const {userName,password} = this.state;
		return(
			
			<Root>
				<div>
					<div>
						<header className="login_header">
							<img src={logo} />
							<p>SAAS平台运营</p>
						</header>
						<div style={{position: 'fixed'}}>
							<img src={loginBcg} />
						</div>
						<div className="login_wrap">
							<form className="login_form">
								<h4 className="login_style">
									<strong>账号登录</strong>
								</h4>
								<div className="login_text">
									<Icon type="user" />
									<input placeholder="用户名" type="text" onChange={this.loginChange.bind(event,'userName')} value={userName} />
								</div>
								<div className="login_text">
									<Icon type="lock" />
									<input placeholder="密码" type="password" onChange={this.loginChange.bind(event,'password')} value={password} />
								</div>
								<div className="login_botton">
									<Button type="primary" style={{width:'100%'}} onClick={this.login}>登录</Button>
								</div>
							</form>
						</div>
						<Modal title={this.state.title} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} width='50%' maskClosable={false}
					footer={[<Button key="submit" type="primary" onClick={this.loginStore}>登录</Button>,]}>
				
				</Modal>
						<footer className="login_foot">
							<hr />
							<p>Copyright © 2018 SouChe All Rights Reserved</p>
						</footer>
					</div>
	</div>
      </Root>
		);
	}
}

export default Login;
