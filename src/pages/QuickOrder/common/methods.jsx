import React from 'react';
import { Spin, Select } from 'antd';
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';

const { Option } = Select;
export const SpinRender = <Spin size='small' style={{ padding: '10px' }} />;
// 下拉框渲染
export const getOptionRender = (arr, { key = '', code = '', name = '' }) =>
  (Array.isArray(arr)
    ? arr.map(item => (
      <Option key={item[key]} value={item[code]}>
        {item[name]}
      </Option>
    ))
    : null);

// 计算金额总数
export const getTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0) {
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);

// 计算客户应收金额
export const getReceiveTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0 && item.settleTypeCode == '70050000') { //计算客户付费
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);

//计算非套餐
export const getNoComboTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0 && !item.comboGoodsId) {
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);

// 金额默认设置
/* decimalsCut({ num: 2, type: 'down', number: 2.23 }) */
export const decimalsCut = (obj) => {
  const n = Number(obj.num) || 2;
  const type = obj.type || 'down';
  const number = Number(obj.number) || 0;
  if (type == 'down') { //只舍不入
    let digit = Math.pow(10, n);
    return Number(Math.floor(number * digit) / digit);
  }
  if (type == 'up') { //只入不舍
    let digit = Math.pow(10, n);
    return Number(Math.ceil(number * digit) / digit);
  }
}
/** 获取表格所有选中项信息及统计数据  */
export const getSelectedItemsInfo = (data) => {
  let selectRows = data.filter(item => item.checked);
  // 对所有行进行计算，有勾选行则计算勾选行
  if (selectRows.length == 0) selectRows = data.filter(item => item.index != 0);
  // 验证每行的表单，如果有错误，则无法获取选中数据
  // const isFormInValid = selectRows.some(item =>
  //   (item.formValidatorError ? item.formValidatorError.length > 0 : item.formValidatorError));
  // if (isFormInValid) return false;

  const TotalMoney = getTotal(selectRows, 'amount');
  const ReceiveMoney = getTotal(selectRows, 'receivableAmount');
  const TotalNum = getTotal(selectRows, 'qty');
  return {
    selectRows,
    TotalMoney,
    ReceiveMoney,
    TotalNum,
  };
};

// 列表金额计算
export const calculateTable = (dataSource, disaountsAmount, colomnKey) => {
  const DataSource = _.cloneDeep(dataSource);
  // 找到最后一行的套餐长度
  const totalAmount = Number(getNoComboTotal(DataSource, 'amount')); // 金额总计
  const DataLength = DataSource.length - 2;
  let workHoursPreReceive = 0; // 数据源的n-1项非套餐应收金额总和
  if (totalAmount < disaountsAmount) { //优惠金额大于总金额
    message.error('套餐无法优惠，请输入小于非套餐的金额')
  }
  DataSource.forEach((item, index) => {
    item.price = Number(item.price) || 0; // 单价
    const unitPrice = Number(item.price) || 0; // 单价
    const qty = Number(item.qty) || 0; // 数量
    const unitAmount = unitPrice * qty; // 金额
    item.amount = decimalsCut({ number: unitAmount });
    let discountRow; //rowqty rowDiscountRate rowreceivableAmount discountRate receivableAmount
    if (totalAmount < disaountsAmount) { //优惠金额大于总金额
      item.receivableAmount = item.amount;
      item.discountRate = 1.00;
      item.reduceAmount = 0;
      this.setState({ disaountsAmount: 0 })
    } else {
      if ((colomnKey == 'rowdiscountRate' || colomnKey == 'discountRate' || colomnKey == 'rowqty') && !item.comboGoodsId) {
        //折扣率、数量  套餐不可修改应收金额、折扣率
        item.discountRate = item.discountRate;
        item.receivableAmount = decimalsCut({ number: unitPrice * qty * item.discountRate });
      } else if (colomnKey == 'rowreceivableAmount' && item.amount != 0) { //明细的优惠金额
        item.discountRate = decimalsCut({ number: Number(item.receivableAmount / item.amount) });
        item.receivableAmount = item.receivableAmount;
      } else if (colomnKey == 'receivableAmount' && item.amount != 0 && disaountsAmount != 0 && !item.comboGoodsId) {
        //批量的优惠金额 套餐不可修改应收金额、折扣率
        discountRow = accMul(decimalsCut({ number: Number(item.amount / totalAmount) }), disaountsAmount)//优惠金额
        item.receivableAmount = accSub(item.amount, discountRow);
        item.discountRate = decimalsCut({ number: Number(item.receivableAmount / item.amount) });
      } else if (colomnKey == 'receivableAmount' && disaountsAmount == 0) { //批量的优惠金额0
        item.receivableAmount = item.amount;
        item.discountRate = 1.00;
      } else {
        item.discountRate = item.discountRate;
        item.receivableAmount = decimalsCut({ number: unitPrice * qty * item.discountRate });
      }
      item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
      // 最后一行不是套餐
      if (index == DataLength && item.index != 0 && colomnKey == 'receivableAmount' && !item.comboGoodsId) {
        // 只有输入优惠总金额 最后一行非套餐的数据才进行减法
        item.receivableAmount = Number(accSub(accSub(totalAmount, disaountsAmount), workHoursPreReceive));
        item.discountRate = decimalsCut({ number: Number(item.receivableAmount / item.amount) });
        item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
      } else if (!item.comboGoodsId) {
        // 把非套餐的应收金额加起来
        workHoursPreReceive += decimalsCut({ number: item.receivableAmount });
      }
    }
  });
  return DataSource;
}
