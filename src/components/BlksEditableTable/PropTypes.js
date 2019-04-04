import PropTypes from 'prop-types';

const SelectTableMenuPropTypes = {
  delay: PropTypes.number,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  dropDownTableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dropDownTableWidth: PropTypes.number,
  mainKey: PropTypes.string,
  dropDownSpin: PropTypes.node,
  dropDownTableDatasource: PropTypes.arrayOf(PropTypes.object),
  fetchLoading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

const EditableTablePropTypes = {
  rowKey: PropTypes.string, // 通过某个字段名筛选下拉框中的选中项 || table唯一标示字段
  columns: PropTypes.arrayOf(PropTypes.object).isRequired, // 表格配置
  onSearch: PropTypes.func, // 下拉框搜索回调
  onChange: PropTypes.func, // 下拉框选中回调
  onDelete: PropTypes.func, // 删除一行数据回调
  onChangeRow: PropTypes.func, // 改变row中的input框value回调
  onBatchSubmit: PropTypes.func, // 每一列中批量操作回调
  fetchLoading: PropTypes.bool, // 下拉框搜索中loading效果
  dropDownTabledataSource: PropTypes.arrayOf(PropTypes.object), // 下拉框数据源
  dropDownTableColumns: PropTypes.arrayOf(PropTypes.object), // 下拉框表格配置
  dropDownSpin: PropTypes.node, // 下拉框loading样式
  dropDownTableWidth: PropTypes.number, // 下拉框宽度
  className: PropTypes.string, // 表格class
  style: PropTypes.object, // 表格style
  scroll: PropTypes.object,
  placeholder: PropTypes.string,
  rowSelection: PropTypes.object, // 表格checkbox配置
  selectedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])), // 选择项目id集合
  Footer: PropTypes.node, // 表格尾部视图
};

export { SelectTableMenuPropTypes, EditableTablePropTypes };
