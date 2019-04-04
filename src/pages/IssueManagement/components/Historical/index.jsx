import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Table, Modal, Button, message } from 'antd'
import Printing from './assembly/Printing'
import { findListInvSendHistory } from '@/services/getData'
class Historical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shwo: false,
            arr: [],
            List: [],
            ListCopy: [],
            id: "",
            loading: true,
        };
    }

    //获取跳转参数  获取历史
    componentDidMount() {
        // this.findListInvSendHistory({id:'ea66db459349454695482467e733e1fa'})
        // window.addEventListener('message', (e) => {
        //     if (e.data) {
        //         const data = JSON.parse(e.data)
        //         this.findListInvSendHistory(data)
        //     }
        // })
        if (envRouter) { //预发环境
            const data = this.props.location.query;
            if (data) {
                this.findListInvSendHistory(data)
            }
        } else {
            menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
                if (req.jumpFlag) {
                    const data = req;
                    this.findListInvSendHistory(data)
                }
            });
        }
    }
    //获取历史
    findListInvSendHistory = (data) => {
        this.setState({
            loading: true
        })
        findListInvSendHistory(data).then(res => {
            // console.log(res)
            if (res.success) {
                let data = res.data ? res.data : []
                if (res.data.length > 0) {
                    data.map((item, index) => {
                        item['key'] = index + 1
                    })
                }
                this.setState({
                    loading: false,
                    List: data
                })
            } else {
                message.error(res.msg);
                this.setState({
                    loading: false,
                    List: []
                })
            }
        })
    }

    //展开
    open = (e, record) => {
        this.setState({
            //获取所要展开的数据
            ListCopy: this.state.List[record.key - 1].workItemInvIssuedDetHistoryDTOList
        })
        //判断展开收起 
        if (this.state.arr[0] === record.key) {
            this.setState({
                arr: []
            })
        } else {
            this.setState({
                arr: [record.key]
            })
        }
    }

    //打印显示
    Printing = (record) => {
        this.setState({
            show: true,
            id: record.doId
        })
    }

    //打印关闭
    Close = () => {
        this.setState({
            show: false,
            id: ''
        })
    }
    render() {
        const columns = [{
            title: '序号',
            width: 50,
            class: 'ab',
            align: 'center',
            key: 'key',
            dataIndex: 'key'
        }, {
            title: '发料单号',
            width: 200,
            align: 'center',
            key: 'doNo',
            dataIndex: 'doNo'
        }, {
            title: '出库时间',
            width: 200,
            align: 'center',
            key: 'invOutDate',
            dataIndex: 'invOutDate'
        }, {
            title: '服务顾问',
            width: 100,
            align: 'center',
            key: 'scEmpName',
            dataIndex: 'scEmpName'
        }, {
            title: '领/退料人',
            width: 100,
            align: 'center',
            key: 'receiveItemMan',
            dataIndex: 'receiveItemMan'
        }, {
            title: '发料人',
            width: 200,
            align: 'center',
            key: 'sendItemMan',
            dataIndex: 'sendItemMan'
        }, {
            title: '工单备件数',
            width: 100,
            align: 'center',
            key: 'totalQty',
            dataIndex: 'totalQty',
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: '已发数量',
            width: 100,
            align: 'center',
            key: 'totalIssuedQty',
            dataIndex: 'totalIssuedQty',
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: '未发数量',
            width: 100,
            align: 'center',
            key: 'totalNotIssuedQty',
            dataIndex: 'totalNotIssuedQty',
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: '本次出库',
            width: 100,
            align: 'center',
            key: 'thisTimeQty',
            dataIndex: 'thisTimeQty',
            render: (text, record) => (
                <span>
                    {Number(text).toFixed(2)}
                </span>
            ),
        }, {
            title: '操作',
            width: 100,
            // fixed: 'right',
            align: 'center',
            key: 'index10',
            render: (text, record) => (
                <div>
                    <a style={{ display: 'inline-block', width: ' 50%' }} onClick={(e) => this.open(e, record)}>{this.state.arr[0] === record.key ? '收起' : '展开'}</a>
                    {/* <a onClick={this.Printing.bind(this, record)}>打印</a> */}
                </div>
            )
        }]
        const expandedRowRender = () => {
            const columnsCopy = [{
                title: '商品编码',
                width: '50px',
                align: 'center',
                key: 'goodsNo',
                dataIndex: 'goodsNo'
            }, {
                title: '商品名称',
                width: '50px',
                align: 'center',
                key: 'goodsName',
                dataIndex: 'goodsName'
            }, {
                title: '单位',
                width: '50px',
                align: 'center',
                key: 'goodsUnit',
                dataIndex: 'goodsUnit'
            }, {
                title: '数量',
                width: '50px',
                align: 'center',
                key: 'qty',
                dataIndex: 'qty',
                render: (text, record) => (
                    <span>
                        {Number(text).toFixed(2)}
                    </span>
                ),
            }, {
                title: '批次号',
                width: '50px',
                align: 'center',
                key: 'batchNo',
                dataIndex: 'batchNo'
            }, {
                title: '仓库',
                width: '50px',
                align: 'center',
                key: 'warehouseName',
                dataIndex: 'warehouseName'
            }, {
                title: '库位',
                width: '50px',
                align: 'center',
                key: 'locationName',
                dataIndex: 'locationName'
            }, {
                title: '销售单价',
                width: '50px',
                align: 'center',
                key: 'price',
                dataIndex: 'price',
                render: (text, record) => (
                    <span>
                        {Number(text).toFixed(2)}
                    </span>
                ),
            },]
            return (
                <Table
                    columns={columnsCopy}
                    dataSource={this.state.ListCopy}
                    pagination={false}
                />)
        }


        return (
            <div>
                <p className='list-page_title'>发货历史</p>
                <Table
                    loading={this.state.loading}
                    bordered //边框
                    scroll={{ x: 1450, y: 900 }}//滚动条
                    dataSource={this.state.List} //数据源
                    columns={columns} //表格列
                    expandedRowRender={expandedRowRender}
                    expandedRowKeys={this.state.arr}
                    pagination={false}
                    onExpand={this.open}
                    rowKey={row => row.key}
                />
                <Modal title='打印' onCancel={this.Close} visible={this.state.show} width='80%' height='500px' maskClosable={true} destroyOnClose={true}
                    footer={[
                        <Button key='back' onClick={this.Close}>
                            关闭
                    </Button>,
                    ]}>
                    <Printing src={'http://114.55.2.156:8888/WebReport/ReportServer?reportlet=/saas/jiaochequerendan.cpt&id=' + this.state.id} />
                </Modal>
            </div>
        )
    }
}
export default withRouter(Historical)