import React from 'react';
import { Spin, Select } from 'antd';
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';

const { Option } = Select;
// 下拉框渲染
export const getOptionRender = (arr, { key = '', code = '', name = '' }) =>
  (Array.isArray(arr)
    ? arr.map(item => (
      <Option key={item[key]} value={item[code]}>
        {item[name]}
      </Option>
    ))
    : null);
// 计算数组中某项的总和
export const getTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key]) {
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);
// 计算数组中某项的总和
export const getChekedTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.checked) {
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);
