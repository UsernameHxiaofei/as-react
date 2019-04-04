import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { fromJS, is } from 'immutable';
import { Select, Spin } from 'antd';
import { SelectTableMenuPropTypes } from './PropTypes';

const { Option, OptGroup } = Select;
const spinRender = <Spin size='small' style={{ padding: '10px' }} />;
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  let r = Math.random() * 16 | 0,
    v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
const OptionsTitle = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    border-radius: 4px 4px 0 0;
  }
  table > thead > tr > th {
    background: #fafafa;
    transition: background 0.3s ease;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    word-break: break-word;
    height: 40px;
    font-size: 13px;
  }
`;
const OptionsBody = styled.div`
  margin: 0;
  padding: 0;
  table {
    width: 100%;
    text-align: left;
    border-radius: 4px 4px 0 0;
  }
  table > tbody > tr > td {
    padding: 12px;
    word-break: break-word;
    border-bottom: 1px solid #e8e8e8;
    transition: all 0.3s, border 0s;
  }
`;

class SelectTableMenu extends Component {
  static defaultProps = {
    delay: 800,
    loadingSpin: spinRender,
    rowKey: 'id',
    notFoundContent: '',
    placeholder: '请搜索',
    value:[]
  };

  static propTypes = SelectTableMenuPropTypes;

  constructor(props) {
    super(props);
    const { delay } = this.props;
    this.lastFetchId = 0;
    this.handleSearch = debounce(this.handleSearch, delay);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
  // }

  /** 渲染下拉框表格头部 */
  renderTitle = () => {
    const { dropDownTableColumns } = this.props;
    return (
      <OptionsTitle>
        <table>
          <thead>
            <tr>
              {dropDownTableColumns && dropDownTableColumns.length
                ? dropDownTableColumns.map(item => (
                  <th key={item.key} width={`${item.width}%` || null}>
                    {item.title}
                  </th>
                  ))
                : null}
            </tr>
          </thead>
        </table>
      </OptionsTitle>
    );
  };

  /** 选中回调 */
  handleChange = (value) => {
    const { rowKey, onChange, dropDownTableDatasource } = this.props;
    const selectObj = dropDownTableDatasource.find(item => item[rowKey] === value);
    if (selectObj) {
      onChange(selectObj);
    }
  };

  /** 搜索回调 */
  handleSearch = (value) => {
    const { onSearch } = this.props;
    onSearch(value);
  };

  render() {
    const {
      tableWidth,
      loadingSpin,
      fetchLoading,
      notFoundContent,
      dropDownTableColumns,
      dropDownTableDatasource,
      className,
      style,
      placeholder,
      value,
      rowKey,
    } = this.props;
    const options = (
      <OptGroup label={this.renderTitle()}>
        {dropDownTableDatasource
          ? dropDownTableDatasource.map(opt => (
            <Option key={opt ? opt[rowKey] : ''} value={opt ? opt[rowKey] : ''} disabled={opt ? value.indexOf(opt[rowKey]) > -1 : true}>
              <OptionsBody>
                <table>
                  <tbody>
                    <tr>
                      {dropDownTableColumns
                          ? dropDownTableColumns.map((item, index) => (
                            <td
                              key={uuid()}
                              width={`${item.width}%` || null}
                            >
                              {opt[item.key]}
                            </td>
                            ))
                          : null}
                    </tr>
                  </tbody>
                </table>
              </OptionsBody>
            </Option>
            ))
          : null}
      </OptGroup>
    );
    return (
      <Select
        dropdownClassName='blks-component-editable-table-search-dropdown'
        showSearch
        value={undefined}
        placeholder={placeholder}
        notFoundContent={fetchLoading ? loadingSpin : notFoundContent}
        filterOption={false}
        dropdownStyle={{ width: tableWidth }}
        defaultActiveFirstOption={false}
        dropdownMatchSelectWidth={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        className={className}
        style={{ ...style }}
      >
        {options}
      </Select>
    );
  }
}

export default SelectTableMenu;
