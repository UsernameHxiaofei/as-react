import {Modal}from 'antd'

export const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 16 },
  },
};
export const formSpanLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
  },
};

export const DelErrorMsg = (msg) => {
  // 错误提示
  Modal.error({
    title: msg,
    okText: '确认',
  });
};

export const showTotal = total => `共 ${total} 条`;