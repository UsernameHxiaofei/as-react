import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { fromJS, is } from 'immutable';
import cloneDeep from 'lodash/cloneDeep';
import { Table, Button, Form, Row, Col, message } from 'antd';
import { EditableTablePropTypes } from './PropTypes';
import { EditableFormRow, EditableCell } from './EditableCell';
import { EditableHeaderFormRow, EditableHeaderCell } from './EditableHeaderCell';
import { getErrorInfo, isNotNullOrUndefined } from './utils';

const normalize = (identify, data) => {
  const newMap = {};
  data.forEach((item) => {
    const key = item[identify] || item.key;
    newMap[key] = item;
  });
  return newMap;
};
const TableRender = styled.div`
  .ant-table-tbody tr td:nth-child(1) {
    // text-align: center;
  }
  .ant-table-footer {
    padding: 0;
  }
  .ant-form-item {
    margin: 0;
  }
`;

class EditableTable extends Component {
  state = {
    newDataSource: [],
  };
  static defaultProps = {
    selectedRowKeys: [],
    hasRowSelection: false,
    decimalCount: 2,
    size: 'default',
    scroll: { x: 1080 },
    rowKey: 'id',
  };
  static propTypes = EditableTablePropTypes;
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
  // }

  componentDidMount() {
    // 给每行表单添加验证错误信息
    const { dataSource, columns } = this.props;
    const newMap = normalize('dataIndex', columns);
    const tmpDataSource = cloneDeep(dataSource);
    const newDataSource = tmpDataSource.reduce((newArr, item) => {
      item.formValidatorError = [];
      for (const key in item) {
        const { cellOption } = newMap[key] || {};
        if (cellOption && Array.isArray(cellOption.rules)) {
          const { rules } = cellOption;
          const newValidition = getErrorInfo(rules, item[key], key, item);
          if (newValidition.errMsg.length)item.formValidatorError.push(newValidition);
        }
      }
      newArr.push(item);
      return newArr;
    }, []);
    this.setState({ newDataSource });
  }
  componentWillReceiveProps(nextProps) {
    // 给每行表单添加验证错误信息
    //if (!is(fromJS(this.props.dataSource), fromJS(nextProps.dataSource))) {
      const { dataSource, columns } = nextProps;
      const newMap = normalize('dataIndex', columns);
      const tmpDataSource = cloneDeep(dataSource);
      const newDataSource = tmpDataSource.reduce((newArr, item) => {
        item.formValidatorError = [];
        for (const key in item) {
          const { cellOption } = newMap[key] || {};
          if (cellOption && Array.isArray(cellOption.rules)) {
            const { rules } = cellOption;
            const newValidition = getErrorInfo(rules, item[key], key, item);
            if (newValidition.errMsg.length)item.formValidatorError.push(newValidition);
          }
        }
        newArr.push(item);
        return newArr;
      }, []);
      this.setState({ newDataSource });
   // }
  }

  /** 增加一样数据  */
  handleAdd = (row) => {
    const {
      dataSource, onAdd, columns, rowKey,
    } = this.props;
    const id = row[rowKey];
    const newRow = this.createRow(columns, row);
    const isExist = dataSource.find(item => item.rowKey === id);
    if (!isExist) {
      const newDataSource = [newRow, ...dataSource];
      onAdd(newRow, newDataSource);
    } else {
      message.error('此项已选');
    }
  };

  /** 根据columns配置和下拉框数据生成一条新的row  */
  createRow = (columns, row) => {
    const newRow = columns.reduce(
      (obj, item) => {
        const key = item.key || item.dataIndex;
        obj[key] =
          row[key] ||
          (item.cellOption
            ? isNotNullOrUndefined(item.cellOption.initialValue)
              ? item.cellOption.initialValue
              : null
            : null);

        return obj;
      },
      {},
    );
    return { ...row, ...newRow };
  };

  /** table checkbox onChang/onSelect 回调 */
  handleChangeSelectRow(selectedRowKeys, selectedRows, selected, record, changeRows) {
    const { onSelectRow } = this.props;
    // onSelectRow(selectedRowKeys, selectedRows, selected, record, changeRows);
  }

  render() {
    const {
      onSearch,
      onChangeRow,
      onBatchSubmit,
      dropDownTabledataSource: data,
      dataSource,
      columns,
      selectedRowKeys,
      Footer,
      scroll,
      size,
      rowKey,
      ...restProps
    } = this.props;
    const { newDataSource } = this.state;
    const components = {
      header: {
        row: EditableHeaderFormRow,
        cell: EditableHeaderCell,
      },
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // 表格行配置
    const newColumns = columns.map((col) => {
      let newCol = {};
      const { headerOption, cellOption } = col;
      if (!cellOption && !headerOption) {
        return col;
      }
      if (headerOption) {
        newCol = {
          ...col,
          onHeaderCell: column => ({
            column,
            dropDownTitle: col.title,
            propName: col.dataIndex || col.key,
            headerOption,
            onBatchSubmit:
              typeof onBatchSubmit === 'function'
                ? e => onBatchSubmit(e, col.key || col.dataIndex || null)
                : null,
            ...restProps,
          }),
        };
      }
      if (cellOption) {
        newCol = {
          ...col,
          onCell: record => ({
            record: {
              ...record,
              [col.dataIndex || col.key]: record[col.dataIndex || col.key],
            },
            width: col.width,
            propName: col.dataIndex || col.key,
            cellOption,
            editable: true,
            dataIndex: col.dataIndex,
            handleSearch: onSearch,
            handleAdd: this.handleAdd,
            handleChangeRow: onChangeRow,
            dataSource: data || [],
            rowKey,
            ...restProps,
          }),
          ...newCol,
        };
      }
      return newCol;
    });
    return (
      <Fragment>
        <TableRender>
          <Table
            rowClassName={() => 'blksEditableTable_editable-row'}
            size={size}
            scroll={{ ...scroll }}
            components={components}
            bordered
            dataSource={newDataSource.length ? newDataSource : dataSource}
            columns={newColumns}
            footer={() => Footer}
            pagination={false}
            rowKey={rowKey}
            {...restProps}
          />
        </TableRender>
      </Fragment>
    );
  }
}

export default EditableTable;
