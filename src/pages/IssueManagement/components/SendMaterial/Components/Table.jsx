import React, { Component, Fragment } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { env } from '../../../../../config/env';
import { Table, Pagination, Modal, Button } from 'antd'
import { getIssuedOrderStatus } from '@/services/getData'
import { connect } from 'react-redux'
import { object } from 'prop-types';
import styled from 'styled-components';
import Printing from '../../Historical/assembly/Printing'
const { REDIRECTION_URL: { Historical, ReturnOfWorkOrders, WorksheetIssue }, HOST } = env;
const Roow = styled.div`
text-align:center;
.Operation{
    display: inline-block;
    width:40px
}
.OperationCopy{
    display: inline-block;
    width:40px;
    color:#999
}
.time{
    min-width:200px
}
`
class TableBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shwo: false,
            id: '',
        };
    }
    componentDidMount() {
        if (this.props.title === '1') {
            this.props.queryOneWorkSetting()
        }
    }
    query = (current) => {
        if (this.props.title === '1') {
            let data = Object.assign({}, this.props.data, {
                currentIndex: current
            })
            this.props.SET_STATE({
                data: data
            })
            this.props.getIssuedOrderList(data, this.props.title)
        } else {
            let data = Object.assign({}, this.props.dataCopy, {
                currentIndex: current
            })
            this.props.SET_STATE({
                dataCopy: data
            })
            this.props.getIssuedOrderList(data, this.props.title)
        }

    }
    dispatch = (record) => {
        let dataCopy = this.props.title === '1' ? this.props.data : this.props.dataCopy
        let data = { id: record.id, title: this.props.title, dataCopy }
        // 获取工单状态  退料 发料需判断订单状态
        this.getIssuedOrderStatus(data);

    }

    getIssuedOrderStatus = (data) => {
        getIssuedOrderStatus({ id: data.id }).then(res => {
            if (res.success) {
                const recordCopy = {
                    id: data.id,
                    jumpFlag: true,
                };
                const _data = JSON.stringify(recordCopy);// 转为字符串
                let autoMessage = {}
                if (data.title === '1') {
                    autoMessage = {
                        name: '工单发料信息', index: `orderCheckwmb${recordCopy.id}`, url: WorksheetIssue, resId: 'sendOrder', infoData: _data,
                    };
                    if (envRouter) { //预发环境
                        this.props.history.push({ pathname: '/WorksheetIssue', query: recordCopy });
                    } else {
                        menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
                            menuRouter.open(autoMessage.url, recordCopy, { title: autoMessage.name });
                        });
                    }
                } else if (data.title === '2') {
                    autoMessage = {
                        name: '发料退库信息', index: `orderCheckCopyOne${recordCopy.id}`, url: ReturnOfWorkOrders, resId: 'orderCheckCopyOne', infoData: _data,
                    };
                    if (envRouter) { //预发环境
                        this.props.history.push({ pathname: '/ReturnOfWorkOrders', query: recordCopy });
                    } else {
                        menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
                            menuRouter.open(autoMessage.url, recordCopy, { title: autoMessage.name });
                        });
                    }
                }
                // window.parent.postMessage(autoMessage, HOST);

            } else {
                let Tips = data.title === '1' ? '不可发料' : '不可退料'
                message.error(res.msg + Tips);
                this.getIssuedOrderList(data.dataCopy, data.title)
            }
        })
    }

    Jump = (record) => {
        const data = {
            id: record.id,
            jumpFlag: true,
        };
        // const _data = JSON.stringify(data);// 转为字符串
        // const autoMessage = {
        //     name: '发料历史', index: `orderCheckCopy${record.id}`, url: 'Historical', resId: 'checkOrder', infoData: _data,
        // };
        //   window.parent.postMessage(autoMessage, HOST);
        if (envRouter) { //预发环境
            this.props.history.push({ pathname: '/Historical', query: data });
        } else {
            menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
                menuRouter.open(Historical, data, { title: '发料历史' });
            });
        }
    }
    Printing = (record) => {
        this.setState({
            show: true,
            id: record.id
        })
    }
    Close = () => {
        this.setState({
            show: false,
            id: ''
        })
    }
    render() {
        function showTotal(total) {
            return `共 ${total} 条`;
        }
        const columns = [{
            title: "序号",
            width: 100,
            align: "center",
            key: "key",
            dataIndex: "key"
        }, {
            title: "工单类型",
            width: 150,
            align: "center",
            key: "orderTypeName",
            dataIndex: "orderTypeName"
        }, {
            title: "工单号",
            width: 200,
            align: "center",
            key: "woNo",
            dataIndex: "woNo"
        }, {
            title: "发料单号",
            width: 200,
            align: "center",
            key: "doNo",
            dataIndex: "doNo"
        }, {
            title: "业务类型",
            width: 150,
            align: "center",
            key: "bizTypeName",
            dataIndex: "bizTypeName"
        }, {
            title: "客户名称",
            width: 150,
            align: "center",
            key: "cusName",
            dataIndex: "cusName"
        }, {
            title: "车牌号",
            width: 150,
            align: "center",
            key: "carPlateNo",
            dataIndex: "carPlateNo"
        }, {
            title: "VIN",
            width: 200,
            align: "center",
            key: "vin",
            dataIndex: "vin"
        }, {
            title: "服务顾问",
            width: 150,
            align: "center",
            key: "scEmpName",
            dataIndex: "scEmpName"
        }, {
            title: "工单备件数",
            width: 150,
            align: "center",
            key: "totalIssueNeededQty",
            dataIndex: "totalIssueNeededQty",
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: "已发数量",
            width: 100,
            align: "center",
            key: "totalIssuedQty",
            dataIndex: "totalIssuedQty",
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: "剩余数量",
            width: 100,
            align: "center",
            key: "remainingQty",
            dataIndex: "remainingQty",
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: this.props.title === '1' ? '创建时间' : '最近发料时间',
            className: 'time',
            align: "center",
            key: "createDate",
            dataIndex: this.props.title === '1' ? 'createDate' : 'recentlyIssuedTime',
        }, {
            title: "操作",
            width: 150,
            fixed: 'right',
            right: '10',
            align: "center",
            key: "action",
            render: (text, record) => (
                <span>
                    {this.props.title === '1' ? (
                        this.props.dicTextNo !== '10000000' ?
                            <a className='Operation' onClick={this.dispatch.bind(this, record)}>发料</a> : <a className='OperationCopy' title='已设置自动发料'>发料</a>) : (
                            <Fragment>
                                <a className='Operation' onClick={this.dispatch.bind(this, record)}>退料</a>
                                <a className='Operation' onClick={this.Jump.bind(this, record)}>历史</a>
                                {/* <a className='Operation' onClick={this.Printing.bind(this, record)}>打印</a> */}
                            </Fragment>
                        )}
                </span>
            )
        }]

        return (
            <Roow>
                <Table
                    bordered //边框
                    loading={this.props.title === '1' ? this.props.loading : this.props.loadingCopy}
                    scroll={{ x: 2050 }}//滚动条
                    dataSource={this.props.title === '1' ? this.props.List : this.props.ListCopy} //数据源
                    columns={columns} //表格列
                    pagination={false}
                />
                <Pagination loading={this.props.title === '1' ? this.props.loading : this.props.loadingCopy} style={{ marginTop: '20px' }} size='small' showQuickJumper current={this.props.title === '1' ? this.props.data.currentIndex : this.props.dataCopy.currentIndex} pageSize={this.props.title === '1' ? this.props.data.pageSize : this.props.dataCopy.pageSize} total={this.props.title === '1' ? this.props.zts : this.props.ztsCopy} showTotal={showTotal} onChange={this.query} />

                <Modal title='打印' onCancel={this.Close} visible={this.state.show} width='80%' height='500px' maskClosable={true} destroyOnClose={true}
                    footer={[
                        <Button key='back' onClick={this.Close}>
                            关闭
                    </Button>,
                    ]}>
                    <Printing src={'http://114.55.2.156:8888/WebReport/ReportServer?reportlet=/saas/jiaochequerendan.cpt&id=' + this.state.id} />
                </Modal>
            </Roow>
        )
    }

}

const mapStateToProps = (state) => {
    const { List, data, zts, ListCopy, dataCopy, ztsCopy, dicTextNo, wait, waitCopy, loading, loadingCopy } = state.SendMaterial
    return { List, data, zts, ListCopy, dataCopy, ztsCopy, dicTextNo, wait, waitCopy, loading, loadingCopy }
}

const mapDispatchToProps = (dispatch) => {
    const { SET_STATE, getIssuedOrderList, queryOneWorkSetting, getIssuedOrderStatus } = dispatch.SendMaterial
    return { SET_STATE, getIssuedOrderList, queryOneWorkSetting, getIssuedOrderStatus }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(TableBody))
