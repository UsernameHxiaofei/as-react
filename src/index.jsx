/* eslint-disable global-require */
import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Provider } from 'react-redux';
import store from './store';
import bootstrap from './bootstrap';
import App from './app';

//全局样式
import './styles';

//原型链方法
import './shared/prototype';

bootstrap().then(() => {
  ReactDOM.render(
    <Provider store={store}>
        <App /> 
    </Provider>,
    document.getElementById('root'),
  );
});
