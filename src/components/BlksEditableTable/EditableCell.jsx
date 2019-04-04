import React, { Component } from 'react';
import { fromJS, is } from 'immutable';
import styled from 'styled-components';
import { Form, InputNumber, Input, message, Select } from 'antd';
import SelectTableMenu from './SelectTableMenu';
import { getErrorInfo, isNotNullOrUndefined } from './utils';

const { Option } = Select;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
const CellStyle = styled.div`
  .editable-cell {
    position: relative;
  }
  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }
`;

class EditableCell extends Component {
  static defaultProps = {
    isFirstFocus: false,
    initialValue: 0,
    step: 1,
  };
  constructor(props) {
    super(props);
    this.state = {
      editing: true,
    };
  }

  componentWillMount() {
    const { cellOption } = this.props;
    const disabled = cellOption ? cellOption.disabled : false;
    this.setState({ editing: !disabled });
  }
  componentDidMount() {
    const { editable, cellOption } = this.props;
    const disabled = cellOption ? cellOption.disabled : false;
    if (editable && !disabled) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    const { editable, cellOption } = this.props;
    const disabled = cellOption ? cellOption.disabled : false;
    if (editable && !disabled) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const flag =
      !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    return flag;
  }

  /** 失去光标 */
  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const {
      record: { formValidatorError = [] },
    } = this.props;
    if (!formValidatorError.length) {
      this.toggleEdit();
    }
  };

  toggleEdit = () => {
    const { cellOption: { disabled } } = this.props;
    if (!disabled) {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          // this.input.focus();
        }
      });
    }
  };

  /** 改变下拉框选项回调 */
  handleChange = (row) => {
    const { handleAdd } = this.props;
    handleAdd(row);
  };

  /** 改变input值  */
  handleChangeValue = (value, key, rules, option) => {
    const {
      record,
      record: { formValidatorError = [] },
      cellOption: { onChange },
    } = this.props;
    const tmpFormValidatorError = getErrorInfo(rules, value, key, record);
    const { errMsg, key: tmpErrorKey } = tmpFormValidatorError || {};
    const newFormValidatorError = [...formValidatorError];
    const index = formValidatorError.findIndex(item => item.key === tmpErrorKey);
    if (errMsg && errMsg.length) {
      if (index >= 0) newFormValidatorError.splice(index, 1, tmpFormValidatorError);
      else newFormValidatorError.push(tmpFormValidatorError);
    } else if (index >= 0) newFormValidatorError.splice(index, 1);
    const newRecord = { ...record, [key]: value, formValidatorError: newFormValidatorError };
    if (typeof onChange === 'function') onChange(newRecord, option, value, key);
  };

  render() {
    const {
      editable,
      record,
      value,
      fetchLoading,
      handleSearch,
      dataSource,
      rowKey,
      delay,
      dropDownTableWidth,
      dropDownTableColumns,
      style,
      className,
      propName,
      cellOption,
      ...restProps
    } = this.props;
    const { editing } = this.state;
    const {
      inputType,
      isFirstFocus,
      initialValue,
      rules,
      step,
      optionRender,
      dropDownOption,
      range,
      getCellRestProps,
      disabled,
      precision
    } = cellOption || {};
    const index = record ? record.index : null;
    const dynamicCellProps = typeof getCellRestProps === 'function' ? getCellRestProps : () => { };
    const errInfo = record
      ? Array.isArray(record.formValidatorError) && record.formValidatorError.length
        ? record.formValidatorError.find(item => item.key === propName)
        : null
      : null;
    const optionArr = dropDownOption && dropDownOption.optionArrName && record ? record[dropDownOption.optionArrName] : [];
    return (
      <td className={className} ref={node => (this.cell = node)}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              switch (inputType) {
                case 'tableSelect': {
                  if (index === 0) {
                    return (
                      <SelectTableMenu
                        dropDownTableColumns={dropDownTableColumns || []}
                        dropDownTableDatasource={dataSource || []}
                        value={value}
                        rowKey={rowKey}
                        fetchLoading={fetchLoading}
                        onChange={this.handleChange}
                        onSearch={handleSearch}
                        tableWidth={dropDownTableWidth}
                        delay={delay}
                        disabled={disabled}
                        style={{ ...style }}
                        className={className}
                      />
                    );
                  }
                  return <div onClick={this.toggleEdit}>{restProps.children}</div>;
                }
                case 'inputNumber': {
                  if (index !== 0) {
                    return editing || (errInfo && Array.isArray(errInfo.errMsg)) ? (
                      <FormItem
                        style={{ margin: 0 }}
                        validateStatus={errInfo ? 'error' : 'success'}
                        help={
                          errInfo && Array.isArray(errInfo.errMsg) ? errInfo.errMsg.join(',') : ''
                        }
                      >
                        <InputNumber
                          value={isNaN(record[propName]) ? ((initialValue) || 0) : (record[propName])}
                          step={step}
                          min={Array.isArray(range) ? range[0] : 0}
                          /* 不清楚如何取消max设定值，暂时写一个比较大的数字 */
                          max={Array.isArray(range) ? range[1] : 999999}
                          style={{ width: '100%' }}
                          autoFocus={!!isFirstFocus}
                          onChange={e => this.handleChangeValue(e, propName, rules)}
                          ref={node => (this.input = node)}
                          {...dynamicCellProps(record)}
                          onFocus={isFirstFocus ? e => e.target.select() : () => { }}
                          precision={precision || 0}
                        />
                      </FormItem>
                    ) : (
                        <CellStyle>
                          <div
                            onClick={this.toggleEdit}
                            className='editable-cell-value-wrap'
                            style={{ paddingRight: 24 }}
                          >
                            {restProps.children}
                          </div>
                        </CellStyle>
                      );
                  }
                  break;
                }
                case 'select': {
                  if (index !== 0) {
                    return (
                      <FormItem
                        style={{ margin: 0 }}
                        validateStatus={errInfo ? 'error' : 'success'}
                        help={errInfo ? errInfo.errMsg : ''}
                      >
                        <Select
                          showSearch
                          allowClear
                          value={
                            record && propName ? record[propName] : initialValue ? 0 : initialValue
                          }
                          style={{ width: '100%' }}
                          placeholder='请选择'
                          optionFilterProp='children'
                          onChange={(e, option) =>
                            this.handleChangeValue(e, propName, rules, option)
                          }
                          ref={node => (this.input = node)}
                          {...dynamicCellProps(record)}
                        >
                          {optionRender ||
                            (dropDownOption && optionArr
                              ? optionArr.map(item => (
                                <Option
                                  key={item[dropDownOption.key] || item[dropDownOption.id]}
                                  value={
                                    item[dropDownOption.id] || item[dropDownOption.dropDownOption]
                                  }
                                >
                                  {item[dropDownOption.name]}
                                </Option>
                              ))
                              : null)}
                        </Select>
                      </FormItem>
                    );
                  }
                  break;
                }
                default:
                  return <div>{restProps.children}</div>;
              }
            }}
          </EditableContext.Consumer>
        ) : (
            restProps.children
          )}
      </td>
    );
  }
}

export { EditableCell, EditableFormRow };
