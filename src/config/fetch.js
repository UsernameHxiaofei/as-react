// import { baseUrl, platUrl, testUrl, cusUrl, masUrl, balanceUrl, webUrl, supplymentUrl, loginUrl, saleUrl } from './env';
import axios from 'axios';
import { env } from './env/';
import CacheUtils from '@souche-f2e/souche-util/lib/cache';
const token = CacheUtils.getCookie('_security_token');


const {
  SERVER_URL: {
    baseUrl, // 整车
    platUrl, // 平台
    masUrl, // 主数据
    cusUrl, // 客商
    balanceUrl, // 结算中心
    supplymentUrl, // 进销存
    saleUrl, // 售后
    testUrl, // 测试
    filesUrl, //音频
  },
  // LOGIN_HOST: loginUrl,
  LOGIN_HOST,
} = env;
export default async (url = '', data = {}, type = 'GET', typeurl = '', method = 'fetch') => {
  type = type.toUpperCase();

  if (typeurl == 'baseUrl') {
    url = baseUrl + url;
  } else if (typeurl == 'platUrl') {
    url = platUrl + url;
  } else if (typeurl == 'testUrl') {
    url = testUrl + url;
  } else if (typeurl == 'cusUrl') {
    url = cusUrl + url;
  } else if (typeurl == 'masUrl') {
    url = masUrl + url;
  } else if (typeurl == 'balanceUrl') {
    url = balanceUrl + url;
  } else if (typeurl == 'supplymentUrl') {
    url = supplymentUrl + url;
  } else if (typeurl == 'saleUrl') {
    url = saleUrl + url;
  } else if (typeurl == 'filesUrl') {
    url = filesUrl + url;
  }
  if (token) {
    url += `?_security_token=${token}`;
  }
  if (type == 'GET') {
    let dataStr = ''; // 数据拼接字符串
    Object.keys(data).forEach((key) => {
      dataStr += `${key}=${data[key]}&`;
    });

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = `${url}&${dataStr}`;
    }
  }

  if (method == 'fetch') {
    const requestConfig = {
      method: type,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    };
    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: data,
      });
    }

    try {
      const instance = axios.create({
        baseURL: '',
        timeout: 25000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const response = await instance
        .request({
          method: type,
          url,
          data,
        })
        .catch((error) => {
          console.log(error);
        });
      const responsJson = await response.data;
      if (responsJson.code === '10001') {
        setTimeout(() => (window.top.location.href = LOGIN_HOST), 800);
      }

      return responsJson;
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject();
      }
      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader('Content-type', 'application/json');
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response;
            console.log(obj, '响应数据');
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj);
          } else {
            reject(requestObj);
          }
        }
      };
    });
  }
};

export const filesExport = ({ filesUrl, ...restParams }) =>
  axios.create({
    baseURL: env.SERVER_URL[filesUrl],
    headers: {
      'Content-Type': 'application/vnd.ms-excel',
      // token: localStorage.getItem('token') || '',
    },
    method: 'post',
    responseType: 'blob', // 返回类型blob
  })(restParams);

