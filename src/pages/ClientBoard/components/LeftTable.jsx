import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import styled from 'styled-components';
import { Table, Icon, Spin } from 'antd';
const Root = styled.div`
  > * {
    margin: 0 auto;
  }
`;
const TableRender = styled.div`
  text-align: center;
  .ant-table td {
    white-space: nowrap;
  }
  .ant-table-pagination.ant-pagination {
    float: none;
  }
  .ant-table-thead {
    word-break: keep-all;
    white-space: nowrap;
  }
`;
class LeftTable extends Component {
  componentDidMount() {
    if (this.props.dataSource.length > 10) {
      this.scrollAuto();
    }
  }

  scroll() {
    const { dataSource } = _.cloneDeep(this.props);
    let tempArr = dataSource.splice(0, 1);
    this.props.SET_STATE({
      dataSource: [...dataSource, ...tempArr]
    });
  }
  scrollAuto() {
    setInterval(() => {
      this.scroll();
    }, 2000);
  }
  render() {
    const { dataSource, tableClassName, listLoading } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address'
      }
    ];
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    return (
      <Root>
        <Spin spinning={listLoading} indicator={antIcon} tip='加载中'>
          {/* <div className={tableHeaderClassName}>
            <span style={{ marginRight: '16px' }}>共{pagetotal}条</span>
          </div> */}
          <TableRender>
            <Table bordered className={tableClassName} dataSource={dataSource} columns={columns} pagination={false} />
          </TableRender>
        </Spin>
      </Root>
    );
  }
}
const mapStateToProps = state => {
  const { dataSource, listLoading } = state.ClientBoard;
  return { dataSource, listLoading };
};

const mapDispatchToProps = dispatch => {
  const { SET_STATE } = dispatch.ClientBoard;
  return { SET_STATE };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftTable);
