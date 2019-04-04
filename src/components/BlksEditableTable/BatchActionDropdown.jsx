import React, { Component } from 'react';
import { fromJS, is } from 'immutable';
import { Form, InputNumber, Input, Popover, Button, Row, Col, Select } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;
const BatchForm = styled.div`
  .ant-form-item {
    margin: 0;
    margin-right: 8px;
  }
  .ant-form-item-control {
    line-height: 0;
  }
  .custom-filter-dropdown {
    padding: 8px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }

  .custom-filter-dropdown button {
    margin-right: 8px;
  }
`;
class BatchActionDropdown extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isDropdownMenuVisible) {
      setTimeout(() => this.searchInput.focus());
    }
  }
  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (e) => {
    const {
      onCloseDropdown,
      form: { resetFields },
    } = this.props;
    if (e && this.cell && this.cell !== e.target && !this.cell.contains(e.target)) {
      new Promise((resolve, reject) => {
        onCloseDropdown(false, resolve);
      }).then(res => setTimeout(() => resetFields(), 100));
    }
  };
  handleSubmit = () => {
    const {
      form: { validateFields, resetFields },
      onSubmit,
      propName,
      onChange,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { inputNumberValue } = values;
        onSubmit(inputNumberValue);
        onChange(inputNumberValue, propName);
        resetFields();
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator, resetFields, getFieldsValue },
      otherAction,
      rules,
      range,
      step,
      placeholder,
      inputType,
      optionRender,
      onChange,
      precision
    } = this.props;
    const newButtonRender = otherAction
      ? otherAction.render({ value: getFieldsValue(), comfirm: resetFields })
      : null;
    return (
      <BatchForm>
        <div className='custom-filter-dropdown' ref={node => (this.cell = node)}>
          <div style={{ display: inputType === 'inputNumber' ? 'inline-block' : 'none' }}>
            <FormItem style={{ display: 'inline-block' }}>
              {getFieldDecorator('inputNumberValue', {
                rules: Array.isArray(rules) ? rules : null,
              })(<InputNumber
                placeholder={placeholder}
                ref={node => (this.searchInput = node)}
                step={step || 1}
                min={Array.isArray(range) ? range[0] : 0}
                /* 不清楚如何取消max设定值，暂时写一个比较大的数字 */
                max={Array.isArray(range) ? range[1] : 999999}
                // onFocus={e => e.target.select()}
                style={{ width: '100%' }}
                precision={precision || 0}
              />)}
            </FormItem>
            <Button type='primary' onClick={this.handleSubmit}>
              确定
            </Button>
            {!otherAction ? (
              <Button
                onClick={() => {
                  resetFields();
                  this.searchInput.focus();
                }}
              >
                重置
              </Button>
            ) : (
                newButtonRender
              )}
          </div>
          <div style={{ display: inputType === 'select' ? 'inline-block' : 'none' }}>
            <FormItem style={{ display: 'inline-block' }}>
              <Select
                showSearch
                allowClear
                style={{ width: '108px' }}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={(e, option) => onChange(e, option)}
                ref={node => (this.searchInput = node)}
              >
                {optionRender}
              </Select>
            </FormItem>
          </div>
        </div>
      </BatchForm>
    );
  }
}
const BatchActionDropdownForm = Form.create()(BatchActionDropdown);
export { BatchActionDropdownForm };
