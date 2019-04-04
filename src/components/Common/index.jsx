import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { dispatch } from '@/store';
import {
  Table,
  Icon,
  Divider,
  Select,
  Button,
  Modal,
  Input,
  Tree,
  Spin,
  message,
  Pagination,
  Tooltip,
  Tag,
  Popover
} from 'antd';
import { Trim } from '@/config/methods.js';
import {
  getGlobalMdmRegion,
  listCustomerByKeyWord,
  listCustomerByAdvCondition,
  getDicDataByCategoryCode,
  highSearch,
  getBasValueByBasCategoryNo,
  querySupplierBySupplierName,
  queryMdmCarModelTreeVoTree,
  queryRelationshipByCriteria
} from '../../services/getData';
const Root = styled.div`
  > * {
  }
  del {
    text-decoration: line-through;
  }
  .anticon {
    &:hover {
      color: #268df5;
      cursor: pointer;
    }
  }
  .sou_tit {
    margin-right: 10px;
  }
`;
const Option = Select.Option;
const { TextArea } = Input;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
const dataList = [];
const checkList = [];
const { CheckableTag } = Tag;

let timeout;
let currentValue;
const generateList = data => {
  //处理列表数据
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({
      key,
      title: node.title
    });
    if (node.children) {
      generateList(node.children);
    }
  }
};
const generateCheckList = data => {
  //处理目标列表的数据
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    checkList.push({
      key,
      title: node.title
    });
    if (node.children) {
      generateCheckList(node.children);
    }
  }
};
function showTotal(total) {
  return `共 ${total} 条`;
}
//TODO :客户选择
class SeniorSelectCus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedCusData: {
        cusId: '',
        cusName: ''
      },
      selectId: '',
      value: undefined,
      checked: true,
      dataSource: [],
      selectedTags: [],
      selectVisible: false,
      total: 1,
      cusTag: [],
      selectedList: [],
      title: '',
      placeholder: '',
      seniorCusData: {
        index: 1,
        pageSize: 5,
        keyWord: '',
        bizTags: []
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.cusName) {
      this.setState({
        selectedCusData: nextProps.data,
        value: (nextProps.data || '').cusName
      });
    }
  }
  //  queryCusList = () =>{//客户查询
  //  	let queryData = this.state.seniorCusData
  //  		listCustomerByAdvCondition(queryData).then(res=>{
  //  			let dataSource = []
  //  			if(res.success){
  //  				if(res.data){
  //  					res.data.items.forEach((item,index)=>{
  // 		 					dataSource.push({
  // 		 						key:item.cusId,
  // 		 						cusMobileNo:item.cusMobileNo,
  // 		 						cusName:item.cusName,
  // 		 						cusTypeName:item.cusTypeName,
  // 		 						parentCusName:item.parentCusName,
  // 		 						cusTypeId:item.cusTypeId,
  // 		 						cusTelephoneNo:item.cusTelephoneNo,
  // 		 						cusNo:item.cusNo,
  // 		 					})
  // 		 			})
  //  				}
  //  				this.setState({
  //  					dataSource,
  //  					total:(res.data||'').totalNumber
  //  				})
  //  			}

  //  		})
  //  }

  queryDic = () => {
    //查询数据字典
    getDicDataByCategoryCode({ code: '3010' }).then(res => {
      let cusTag = [];
      if (res.success) {
        if (res.data) {
          res.data.forEach((item, index) => {
            cusTag.push({
              key: item.id,
              dicCode: item.dicCode,
              dicValue: item.dicValue
            });
          });
        }

        this.setState({
          cusTag
        });
      }
    });
  };
  fetch = (value, callback) => {
    let _th = this;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    // function fake() {
    //   listCustomerByKeyWord({ keyWord: value }).then(res => {
    //     if (res.success) {
    //       if (currentValue === value) {
    //         const data = [];
    //         if (res.data) {
    //           res.data.forEach(item => {
    //             data.push({
    //               value: item.cusName,
    //               text: item.cusMobileNo || '',
    //               cusId: item.cusId
    //             });
    //           });
    //         }
    //         callback(data);
    //       }
    //     }
    //   });
    // }

    timeout = setTimeout(fake, 300);
  };
  queryBase = () => {
    //查询基础数据值
    getBasValueByBasCategoryNo({ categoryNo: 'CS1000' }).then(res => {
      console.log(res, '基础数据');
      let supType = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          supType.push({
            key: item.id,
            basCode: item.basCode,
            basText: item.basText
          });
        });
        this.setState({
          supType
        });
      }
    });
  };

  handleSearch = value => {
    this.fetch(value, data => this.setState({ data }));
  };
  cusChange = (value, option) => {
    let selectedCusData = this.state.selectedCusData;
    if (value) {
      this.setState(
        {
          value,
          selectedCusData: Object.assign({}, selectedCusData, {
            cusId: value,
            cusName: option.props.children.props.children
          })
        },
        () => {
          this.props.callback(this.state.selectedCusData);
        }
      );
    } else {
      this.setState(
        {
          value: '',
          selectedCusData: Object.assign({}, selectedCusData, { cusId: '', cusName: '' })
        },
        () => {
          this.props.callback(this.state.selectedCusData);
        }
      );
    }
  };
  checkedChange = (tag, checked) => {
    let _th = this;
    this.setState({ checked });
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState(
      {
        selectedTags: nextSelectedTags
      },
      () => {
        let data = this.state.selectedTags;
        let _select = [];
        for (let i = 0; i < data.length; i++) {
          let _data = this.state.cusTag.filter(function (item) {
            return item.dicValue == data[i];
          });
          _select.push(_data[0]);
        }
        let seniorCusData = _th.state.seniorCusData;
        let selectTags = [];
        _select.forEach(item => {
          selectTags.push({
            tagName: item.dicValue,
            tagId: item.dicCode
          });
        });
        this.setState(
          {
            selectedList: _select,
            seniorCusData: Object.assign({}, seniorCusData, { index: 1, pageSize: 5, bizTags: selectTags })
          },
          () => {
            _th.queryCusList();
          }
        );
      }
    );
  };
  open = () => {
    this.setState({
      title: '客户选择',
      placeholder: '客户姓名/联系方式'
    });
    this.queryCusList();
    this.queryDic();
    this.queryBase();
    this.setState({
      selectVisible: true
    });
  };
  cancle = () => {
    this.setState({
      selectVisible: false
    });
  };
  pageChange = (page, pageSize) => {
    let seniorCusData = this.state.seniorCusData;
    let _th = this;
    this.setState(
      {
        seniorCusData: Object.assign({}, seniorCusData, { index: page, pageSize: 5 })
      },
      () => {
        _th.queryCusList();
      }
    );
  };
  inputChange = e => {
    let seniorCusData = this.state.seniorCusData;
    let _th = this;
    this.setState({
      seniorCusData: Object.assign({}, seniorCusData, { keyWord: Trim(e.target.value, 'g') })
    });
  };
  query = () => {
    let seniorCusData = this.state.seniorCusData;
    let _th = this;
    this.setState(
      {
        seniorCusData: Object.assign({}, seniorCusData, { index: 1, pageSize: 5, bizTags: this.state.selectedList })
      },
      () => {
        _th.queryCusList();
      }
    );
  };
  submitCus = () => {
    this.setState({
      selectVisible: false
    });
    this.props.callback(this.state.selectedCusData);
  };
  rowCusClick = (record, e) => {
    let selectedCusData = this.state.selectedCusData;
    let _tr = e.target.parentNode.parentNode.children;
    for (let i = 0; i < _tr.length; i++) {
      _tr[i].style.backgroundColor = '#fff';
      _tr[i].style.color = '#000';
    }
    e.target.parentNode.style.backgroundColor = '#ff571a';
    e.target.parentNode.style.color = '#fff';
    this.setState({
      value: record.cusName,
      selectedCusData: Object.assign({}, selectedCusData, {
        cusId: record.key,
        cusName: record.cusName,
        mobile: record.cusMobileNo
      })
    });
  };

  render() {
    const {
      dataSource,
      total,
      seniorCusData: { keyWord, pageSize, index },
      cusTag,
      selectedTags,
      title,
      placeholder,
      supType
    } = this.state;
    const options = this.state.data.map(d => (
      <Option key={d.cusId}>
        <Tooltip title={this.props.type == 'custom' ? d.value + ' ' + d.text : d.value}>{d.value}</Tooltip>
      </Option>
    ));
    const columns = [
      { title: '客户类型', dataIndex: 'cusTypeName', key: 'cusTypeName', align: 'center' },
      { title: '客户编码', dataIndex: 'cusNo', key: 'cusNo', align: 'center' },
      { title: '客户名称', dataIndex: 'cusName', key: 'cusName', align: 'center' },
      { title: '联系方式', dataIndex: 'cusMobileNo', key: 'cusMobileNo', align: 'center' },
      { title: '客户从属', dataIndex: 'parentCusName', key: 'parentCusName', align: 'center' }
    ];

    return (
      <Root>
        <div style={{ display: 'inline-flex' }}>
          <Select
            showSearch
            allowClear
            value={this.state.value}
            style={{ width: this.props.width, marginRight: '1rem', display: this.props.icon ? 'none' : 'inline-block' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.cusChange}
            notFoundContent={null}
            onSelect={this.select}
          >
            {options}
          </Select>
          <Button type='primary' style={{ display: this.props.icon ? 'none' : 'inline-block' }} onClick={this.open}>
            高级选择
          </Button>
          <span style={{ fontSize: '1.2rem', display: !this.props.icon ? 'none' : 'inline-block' }} onClick={this.open}>
            <Icon type='contacts' />
          </span>
        </div>
        <Modal
          title={title}
          visible={this.state.selectVisible}
          onCancel={this.cancle}
          maskClosable={false}
          width={'40%'}
          footer={[
            <Button key='back' onClick={this.cancle}>
              取消
            </Button>,
            <Button key='submit' type='primary' onClick={this.submitCus}>
              确认选择
            </Button>
          ]}
        >
          <div>
            <span style={{ marginRight: '1rem' }}>关键字:</span>
            <Input
              size='default'
              placeholder={placeholder}
              style={{ width: '30%', marginRight: '1rem' }}
              onChange={this.inputChange}
              value={keyWord}
            />

            <Button type='primary' onClick={this.query} style={{ marginLeft: '1rem' }}>
              查询
            </Button>
          </div>
          <div style={{ margin: '1rem 0' }}>
            {cusTag.map(tag => {
              return (
                <CheckableTag
                  key={tag.dicCode}
                  checked={selectedTags.indexOf(tag.dicValue) > -1}
                  onChange={checked => this.checkedChange(tag.dicValue, checked)}
                >
                  {tag.dicValue}
                </CheckableTag>
              );
            })}
          </div>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            size='small'
            pagination={false}
            onRow={record => {
              return {
                onClick: this.rowCusClick.bind(event, record) // 点击行
              };
            }}
          />
          <Pagination
            style={{ marginTop: '1rem' }}
            size='small'
            total={total}
            pageSize={pageSize}
            current={index}
            showTotal={showTotal}
            onChange={this.pageChange}
          />
        </Modal>
      </Root>
    );
  }
}

//TODO :供应商选择
class SeniorSelectSup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedSupData: {
        supplierId: '',
        supplierName: ''
      },
      selectId: '',
      value: undefined,
      checked: true,
      dataSource: [],
      selectedTags: [],
      selectVisible: false,
      total: 1,
      supTag: [],
      selectedList: [],
      supType: [],
      title: '',
      placeholder: '',
      seniorSupData: {
        keyword: '',
        supplierTypeName: '',
        tagNames: [],
        page: 1,
        pageSize: 5
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.supplierName) {
      this.setState({
        selectedSupData: nextProps.data,
        value: (nextProps.data || '').supplierName
      });
    }
  }
  //  querySupList = () =>{//供应商查询
  //  	let queryData = this.state.seniorSupData
  //  		highSearch(queryData).then(res=>{
  //  			let dataSource = []
  //  			if(res.success){
  //  				if(res.data){
  //  					res.data.items.forEach((item,index)=>{
  // 	 					let _tagName = []
  // 	 					item.tagNames.forEach((ite)=>{
  // 	 						_tagName.push(ite.tagName)
  // 	 					})
  // 	 					dataSource.push({
  // 	 						key:item.supplierMstrId,
  // 	 						supplierNo:item.supplierNo,
  // 	 						supplierName:item.supplierName,
  // 	 						cusTypeName:item.cusTypeName,
  // 	 						tagName:_tagName.join(','),
  // 	 						supplierTypeName:item.supplierTypeName,
  // 	 						parentSupplierName:item.parentSupplierName
  // 	 					})
  // 	 				})
  //  				}
  //  				this.setState({
  //  					dataSource,
  //  					total:(res.data||'').totalNumber
  //  				})
  //  			}

  //  		})
  //  }

  queryDic = () => {
    //查询数据字典
    getDicDataByCategoryCode({ code: '3000' }).then(res => {
      let supTag = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          supTag.push({
            key: item.dicCode,
            dicCode: item.dicCode,
            dicValue: item.dicValue
          });
        });
        this.setState({
          supTag
        });
      }
    });
  };
  fetch = (value, callback) => {
    let _th = this;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      // querySupplierBySupplierName({ supplierName: value }).then(res => {
      //   console.log(res, '123123');
      //   if (res.success) {
      //     if (currentValue === value) {
      //       const data = [];
      //       if (res.data) {
      //         res.data.forEach(item => {
      //           data.push({
      //             value: item.supplierName,
      //             text: item.id || ''
      //           });
      //         });
      //       }
      //       callback(data);
      //     }
      //   }
      // });
    }

    timeout = setTimeout(fake, 300);
  };

  queryBase = () => {
    //查询基础数据值
    getBasValueByBasCategoryNo({ categoryNo: 'CS1000' }).then(res => {
      console.log(res, '基础数据');
      let supType = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          supType.push({
            key: item.id,
            basCode: item.basCode,
            basText: item.basText
          });
        });
        this.setState({
          supType
        });
      }
    });
  };

  handleSearch = value => {
    this.fetch(value, data => this.setState({ data }));
  };
  supChange = (value, option) => {
    let selectedSupData = this.state.selectedSupData;
    if (value) {
      this.setState(
        {
          value,
          selectedSupData: Object.assign({}, selectedSupData, {
            supplierId: value,
            supplierName: option.props.children.props.children
          })
        },
        () => {
          this.props.callback(this.state.selectedSupData);
        }
      );
    } else {
      this.setState(
        {
          value: '',
          selectedSupData: Object.assign({}, selectedSupData, { supplierId: '', supplierName: '' })
        },
        () => {
          this.props.callback(this.state.selectedSupData);
        }
      );
    }
  };
  checkedSupChange = (tag, checked) => {
    let _th = this;
    this.setState({ checked });
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState(
      {
        selectedTags: nextSelectedTags
      },
      () => {
        let data = this.state.selectedTags;
        let _select = [];
        for (let i = 0; i < data.length; i++) {
          let _data = this.state.supTag.filter(function (item) {
            return item.dicValue == data[i];
          });
          _select.push(_data[0].dicValue);
        }
        let seniorSupData = _th.state.seniorSupData;
        this.setState(
          {
            selectedList: _select,
            seniorSupData: Object.assign({}, seniorSupData, { page: 1, pageSize: 5, tagNames: _select })
          },
          () => {
            _th.querySupList();
          }
        );
      }
    );
  };
  open = () => {
    this.setState({
      title: '供应商选择',
      placeholder: '供应商名称'
    });
    this.querySupList();
    this.queryDic();
    this.queryBase();
    this.setState({
      selectVisible: true
    });
  };
  cancle = () => {
    this.setState({
      selectVisible: false
    });
  };
  supTypeChange = value => {
    let seniorSupData = this.state.seniorSupData;
    let _th = this;
    if (value) {
      this.setState(
        {
          seniorSupData: Object.assign({}, seniorSupData, { supplierTypeName: value })
        },
        () => {
          _th.query();
        }
      );
    } else {
      this.setState(
        {
          seniorSupData: Object.assign({}, seniorSupData, { supplierTypeName: '' })
        },
        () => {
          _th.query();
        }
      );
    }
  };
  query = () => {
    let seniorSupData = this.state.seniorSupData;
    let _th = this;
    this.setState(
      {
        seniorSupData: Object.assign({}, seniorSupData, { index: 1, pageSize: 5, tagNames: this.state.selectedList })
      },
      () => {
        _th.querySupList();
      }
    );
  };
  pageChange = (page, pageSize) => {
    let seniorSupData = this.state.seniorSupData;
    let _th = this;
    this.setState(
      {
        seniorSupData: Object.assign({}, seniorSupData, { page: page, pageSize: 5 })
      },
      () => {
        _th.querySupList();
      }
    );
  };
  inputChange = e => {
    let seniorSupData = this.state.seniorSupData;
    let _th = this;
    this.setState({
      seniorSupData: Object.assign({}, seniorSupData, { keyword: Trim(e.target.value, 'g') })
    });
  };
  submitSup = () => {
    console.log('供应商');
    this.setState({
      selectVisible: false
    });
    this.props.callback(this.state.selectedSupData);
  };
  rowSupClick = (record, e) => {
    console.log(e, record, '111111');
    let _tr = e.target.parentNode.parentNode.children;
    for (let i = 0; i < _tr.length; i++) {
      _tr[i].style.backgroundColor = '#fff';
      _tr[i].style.color = '#000';
    }
    e.target.parentNode.style.backgroundColor = '#ff571a';
    e.target.parentNode.style.color = '#fff';
    let selectedSupData = this.state.selectedSupData;
    this.setState({
      value: record.supplierName,
      selectedSupData: Object.assign({}, selectedSupData, { supplierId: record.key, supplierName: record.supplierName })
    });
  };

  render() {
    const {
      dataSource,
      total,
      supTag,
      selectedTags,
      title,
      placeholder,
      supType,
      seniorSupData: { supplierTypeName, keyword, page, pageSize }
    } = this.state;
    const options = this.state.data.map(d => (
      <Option key={d.text}>
        <Tooltip title={d.value}>{d.value}</Tooltip>
      </Option>
    ));

    const columnsSup = [
      { title: '供应商编码', dataIndex: 'supplierNo', key: 'supplierNo', align: 'center' },
      { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', align: 'center' },
      { title: '业务标签', dataIndex: 'tagName', key: 'tagName', align: 'center' },
      { title: '供应商类型', dataIndex: 'supplierTypeName', key: 'supplierTypeName', align: 'center' },
      { title: '上级供应商', dataIndex: 'parentSupplierName', key: 'parentSupplierName', align: 'center' }
    ];

    return (
      <Root>
        <div style={{ display: 'inline-flex' }}>
          <Select
            showSearch
            allowClear
            value={this.state.value}
            style={{ width: this.props.width, marginRight: '1rem', display: this.props.icon ? 'none' : 'inline-block' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.supChange}
            notFoundContent={null}
            onSelect={this.select}
          >
            {options}
          </Select>
          <Button type='primary' style={{ display: this.props.icon ? 'none' : 'inline-block' }} onClick={this.open}>
            高级选择
          </Button>
          <span style={{ fontSize: '1.2rem', display: !this.props.icon ? 'none' : 'inline-block' }} onClick={this.open}>
            <Icon type='contacts' />
          </span>
        </div>
        <Modal
          title={title}
          visible={this.state.selectVisible}
          onCancel={this.cancle}
          maskClosable={false}
          width={'40%'}
          footer={[
            <Button key='back' onClick={this.cancle}>
              取消
            </Button>,
            <Button key='submit' type='primary' onClick={this.submitSup}>
              确认选择
            </Button>
          ]}
        >
          <div>
            <span style={{ marginRight: '1rem' }}>关键字:</span>
            <Input
              size='default'
              placeholder={placeholder}
              style={{ width: '30%', marginRight: '1rem', marginBottom: '10px' }}
              onChange={this.inputChange}
              value={keyword}
            />
            <span style={{ marginRight: '1rem' }}>供应商类型:</span>
            <Select allowClear style={{ width: '30%' }} onChange={this.supTypeChange} value={supplierTypeName}>
              {supType.map((item, index) => {
                return (
                  <Option key={item.key} value={item.basText}>
                    {item.basText}
                  </Option>
                );
              })}
            </Select>
            <Button type='primary' onClick={this.query} style={{ marginLeft: '1rem' }}>
              查询
            </Button>
          </div>
          <div style={{ margin: '1rem 0' }}>
            {supTag.map(tag => {
              return (
                <CheckableTag
                  key={tag.dicCode}
                  checked={selectedTags.indexOf(tag.dicValue) > -1}
                  onChange={checked => this.checkedSupChange(tag.dicValue, checked)}
                >
                  {tag.dicValue}
                </CheckableTag>
              );
            })}
          </div>
          <Table
            bordered
            dataSource={dataSource}
            columns={columnsSup}
            size='small'
            pagination={false}
            onRow={record => {
              return {
                onClick: this.rowSupClick.bind(event, record) // 点击行
              };
            }}
          />
          <Pagination
            style={{ marginTop: '1rem' }}
            size='small'
            total={total}
            pageSize={pageSize}
            current={page}
            showTotal={showTotal}
            onChange={this.pageChange}
          />
        </Modal>
      </Root>
    );
  }
}

//TODO :地址选择
class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provinceList: [],
      cityList: [],
      areaList: [],
      regionData: {
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        areaId: '',
        areaName: ''
      }
    };
  }
  componentDidMount() {
    this.queryProvince(); //查询
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      regionData: nextProps.data
    });
  }
  queryProvince = () => {
    getGlobalMdmRegion({ parentNo: '' }).then(res => {
      console.log(res, '省');
      let data = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          data.push({
            key: item.regionNo,
            regionName: item.regionName,
            regionNo: item.regionNo
          });
        });
        this.setState({
          provinceList: data
        });
      } else {
        Modal.error({
          title: res.msg
        });
      }
    });
  };
  queryCity = id => {
    getGlobalMdmRegion({ parentNo: id }).then(res => {
      console.log(res, '市');
      let data = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          data.push({
            key: item.regionNo,
            regionName: item.regionName,
            regionNo: item.regionNo
          });
        });
        this.setState({
          cityList: data
        });
      } else {
        Modal.error({
          title: res.msg
        });
      }
    });
  };
  queryArea = id => {
    getGlobalMdmRegion({ parentNo: id }).then(res => {
      console.log(res, '区');
      let data = [];
      if (res.success) {
        res.data.forEach((item, index) => {
          data.push({
            key: item.regionNo,
            regionName: item.regionName,
            regionNo: item.regionNo
          });
        });
        this.setState({
          areaList: data
        });
      } else {
        Modal.error({
          title: res.msg
        });
      }
    });
  };
  province = (value, type) => {
    this.queryCity(value);
    let regionData = this.state.regionData;
    this.setState({
      regionData: Object.assign({}, regionData, { provinceId: value, provinceName: type.props.children })
    });
  };
  city = (value, type) => {
    this.queryArea(value);
    let regionData = this.state.regionData;
    this.setState({
      regionData: Object.assign({}, regionData, { cityId: value, cityName: type.props.children })
    });
  };
  area = (value, type) => {
    let regionData = this.state.regionData;
    let _th = this;
    this.setState(
      {
        regionData: Object.assign({}, regionData, { areaId: value, areaName: type.props.children })
      },
      () => {
        this.props.callback(_th.state.regionData);
      }
    );
  };
  render() {
    const {
      provinceList,
      cityList,
      areaList,
      regionData: { provinceName, cityName, areaName }
    } = this.state;
    return (
      <Root>
        <Select style={{ width: this.props.width }} placeholder='省' onChange={this.province} value={provinceName}>
          {provinceList.map((item, value) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.regionName}
              </Option>
            );
          })}
        </Select>
        <Select
          style={{ width: this.props.width, margin: '0 1rem' }}
          placeholder='市'
          onChange={this.city}
          value={cityName}
        >
          {cityList.map((item, value) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.regionName}
              </Option>
            );
          })}
        </Select>
        <Select style={{ width: this.props.width }} placeholder='区' onChange={this.area} value={areaName}>
          {areaList.map((item, value) => {
            return (
              <Option key={item.key} value={item.key}>
                {item.regionName}
              </Option>
            );
          })}
        </Select>
      </Root>
    );
  }
}
//TODO :车型树选择
class CarTypeTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gData: [],
      expandedKeys: [],
      autoExpandParent: true,
      halfCheckedKeys: [],
      searchValue: '',
      checkValue: '',
      goalData: [],
      checkedList: []
    };
  }
  componentDidMount() {
    this.getCarTypeList();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, 'next');
    if (nextProps.treeData.length == 0) {
      this.setState({
        checkedKeys: [],
        expandedKeys: [],
        goalData: nextProps.treeData
      });
    } else {
      let list = [];
      nextProps.treeData.forEach((item, index) => {
        list.push(item.key);
      });
      this.setState({
        goalData: nextProps.treeData,
        checkedKeys: list,
        expandedKeys: list
      });
    }
  }
  getCarTypeList = () => {
    queryMdmCarModelTreeVoTree().then(res => {
      console.log(res, '车型');
      let gData = [];
      if (res.success) {
        if (res.data) {
          gData = this.getList(res.data);
        }
        this.setState({
          gData
        });
      }
    });
  };
  getList = data => {
    let _data = [];
    data.forEach((item, index) => {
      _data.push({
        title: item.name,
        key: item.id,
        parentId: item.parentId,
        parentName: item.parentName,
        modelType: item.modelType,
        children: this.getList(item.children)
      });
    });
    return _data;
  };
  onExpand = expandedKeys => {
    //待选资源树的展开
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };
  onCheckedExpand = expandedKeys => {
    //待选资源树的展开
    this.setState({
      checkKeys: expandedKeys,
      autoExpandParent: false
    });
  };
  onCheck = (checkedKeys, e) => {
    //点击复选框触发
    this.setState({
      checkedKeys,
      halfCheckedKeys: e.halfCheckedKeys,
      expandedKeys: checkedKeys,
      checkKeys: checkedKeys,
      autoExpandParent: true
    });
    let checkData = e.halfCheckedKeys.concat(checkedKeys);

    this.getGoalData(checkData);
  };
  getGoalData = checkedKeys => {
    //已选资源的树结构
    console.log(checkedKeys, '选中');
    let getData = [];
    for (let i = 0; i < this.state.gData.length; i++) {
      const node = this.state.gData[i];
      if (checkedKeys.indexOf(node.key) > -1) {
        let _obj = {
          title: node.title,
          key: node.key,
          children: []
        };
        if (node.children && node.children.length > 0) {
          this.getChildren(node.children, _obj, checkedKeys);
        }
        getData.push(_obj);
      }
    }
    this.getChecked(getData, this.state.checkedKeys);
    this.setState({
      goalData: getData
    });
  };

  getChildren = (children, obj, checkedKeys) => {
    //已选资源树结构的递归
    children.forEach((item, index) => {
      if (checkedKeys.indexOf(item.key) > -1) {
        let _item = {
          title: item.title,
          key: item.key,
          children: []
        };
        obj.children.push(_item);
        if (item.children && item.children.length > 0) this.getChildren(item.children, _item, checkedKeys);
      }
    });
  };
  getChecked = (goalData, checkedKeys) => {
    //得到选中的处理数据
    let getData = [];
    for (let i = 0; i < goalData.length; i++) {
      const node = goalData[i];
      if (node) {
        console.log(node, '0000');
        let _node = {
          key: node.key,
          title: node.title
        };
        if (node.children && node.children.length > 0) {
          getData = getData.concat(this.getClass(node.children, _node));
        }
      }
    }
    let list = {
      carTypeData: getData,
      treeData: goalData
    };

    this.setState(
      {
        checkedList: list
      },
      () => {
        this.props.callback(this.state.checkedList);
      }
    );
  };
  getClass = (childs, brandData) => {
    //选中的数据的递归
    let checkData = [];
    childs.forEach((item, index) => {
      let _item = {
        key: item.key,
        title: item.title
      };
      if (item.children && item.children.length > 0) {
        checkData = checkData.concat(this.getType(item.children, brandData, _item));
      }
    });
    return checkData;
  };
  getType = (childs, brandData, classData) => {
    //选中的数据的递归
    let _checkData = [];
    childs.forEach((item, index) => {
      _checkData.push({
        carBrandId: brandData.key,
        carBrandName: brandData.title,
        carSeriesId: classData.key,
        carSeriesName: classData.title,
        carModelId: item.key,
        carModelName: item.title
      });
    });
    return _checkData;
  };
  checkedChange = e => {
    //已选查询
    const value = e.target.value;
    const checkKeys = checkList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.state.goalData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      checkKeys,
      checkValue: value,
      autoExpandParent: true
    });
  };
  loop = data =>
    data.map(item => {
      //树结构
      const index = item.title.indexOf(this.state.searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + this.state.searchValue.length);
      const title =
        index > -1 ? (
          <span>
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
              {afterStr}
            </span>
          </span>
        ) : (
            <span>{item.title}</span>
          );
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.key} title={title}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
  loopCheck = data =>
    data.map(item => {
      //树结构，可以共用
      const index = item.title.indexOf(this.state.checkValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + this.state.checkValue.length);
      const title =
        index > -1 ? (
          <span>
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{this.state.checkValue}</span>
              {afterStr}
            </span>
          </span>
        ) : (
            <span>{item.title}</span>
          );
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.key} title={title}>
            {this.loopCheck(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
  render() {
    const { gData, expandedKeys, goalData, checkKeys } = this.state;
    generateList(gData);
    generateCheckList(goalData);
    return (
      <Root>
        <div>
          <div style={{ display: 'flex' }}>
            <div style={{ border: '1px solid #ff571a', padding: '0.5rem', marginTop: '0.5rem', width: '50%' }}>
              <div
                style={{ minHeight: '100px', maxHeight: '450px', overflowY: 'auto', maxWidth: 280, overflow: 'hidden' }}
              >
                <Search style={{ marginBottom: 8 }} placeholder='Search' onChange={this.resListChange} />
                <Tree
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                >
                  {this.loop(gData)}
                </Tree>
              </div>
            </div>
            <div style={{ alignSelf: 'center', margin: '0 1rem' }}>
              <Icon type='arrow-right' style={{ fontSize: '2rem' }} />
            </div>
            <div style={{ border: '1px solid #ff571a', padding: '0.5rem', marginTop: '0.5rem', width: '50%' }}>
              <div
                style={{ minHeight: '100px', maxHeight: '450px', overflowY: 'auto', maxWidth: 280, overflow: 'hidden' }}
              >
                <Search style={{ marginBottom: 8 }} placeholder='Search' onChange={this.checkedChange} />
                <Tree
                  onExpand={this.onCheckedExpand}
                  expandedKeys={checkKeys}
                  autoExpandParent={this.state.autoExpandParent}
                >
                  {this.loopCheck(goalData)}
                </Tree>
              </div>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}
//TODO :人车关系
class PersonAndCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data: {
        keyword: '',
        page: 1,
        pageSize: 5,
        isQuerylink: true
      },
      cusName: '',
      dataSourcecopy: '', //总条数
      pagecurrent: 1 //初始页数
    };
  }
  componentDidMount() { }

  add = () => {
    if (this.props.addCar) {
      this.props.addCar();
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.value != undefined || nextProps.value != null) {
      let data = this.state.data;
      this.setState({
        data: Object.assign({}, data, { keyword: nextProps.value })
      });
    }
  }
  query = () => {
    queryRelationshipByCriteria(this.state.data).then(res => {
      //console.log(res,'查询')
      let dataSource = [];
      let dataSourcecopy = '';
      if (res.success) {
        if (res.data) {
          dataSourcecopy = res.data.totalNumber;
          dataSource = res.data.items;
          dataSource.forEach((item, index) => {
            item.key = index;
            item.carNo = item.carPlateTypeName + ' ' + item.carPlateNo;
          });
        }
        this.setState({
          dataSource,
          dataSourcecopy
        });
      } else {
        return message.error(res.msg)
      }
    });
  };
  change = e => {
    let data = this.state.data;
    let _th = this;
    this.setState(
      {
        data: Object.assign({}, data, { keyword: e.target.value })
      },
      () => {
        _th.query();
      }
    );
  };
  select = (record, e) => {
    let data = this.state.data;
    // this.setState({
    // 	data:Object.assign({},data,{keyword:record.cusName})
    // })
    this.props.callback(record);
  };
  onCurrentPage = current => {
    let data = this.state.data;
    this.setState(
      {
        pagecurrent: current,
        data: Object.assign({}, data, { page: current })
      },
      () => {
        this.query();
      }
    );
  };
  render() {
    let than = this;
    let paginationOption = {
      current: this.state.pagecurrent,
      total: this.state.dataSourcecopy,
      pageSize: 5,
      onChange(current) {
        //点击改变页数的选项时调用函数，current:将要跳转的页数
        than.onCurrentPage(current);
      },
      showTotal(total) {
        return `共 ${total} 条`;
      }
    };
    const {
      dataSource,
      data: { keyword }
    } = this.state;
    const text = <span>Title</span>;
    const columns = [
      { title: '姓名', dataIndex: 'cusName', key: 'cusName', align: 'center' },
      { title: '手机号', dataIndex: 'cusContactNo', key: 'cusContactNo', align: 'center' },
      { title: '车牌号', dataIndex: 'carNo', key: 'carPlateNo', align: 'center' },
      { title: 'VIN', dataIndex: 'vin', key: 'vin', align: 'center' }
    ];
    const content = (
      <div style={{ textAlign: 'center' }}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          size='small'
          pagination={paginationOption}
          onRow={record => {
            return {
              onClick: this.select.bind(event, record)
            };
          }}
        />
        <Button type='primary' onClick={this.add.bind(this)} style={{ marginTop: '10px' }}>
          +新增客户车辆
        </Button>
      </div>
    );

    const buttonWidth = 70;
    return (
      <Root>
        <div>
          <Popover placement='bottomLeft' content={content} trigger='hover'>
            <Input
              style={{ width: this.props.width }}
              onChange={this.change}
              value={keyword}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
            />
          </Popover>
        </div>
      </Root>
    );
  }
}

export { SeniorSelectCus, SeniorSelectSup, Address, CarTypeTree, PersonAndCar };
