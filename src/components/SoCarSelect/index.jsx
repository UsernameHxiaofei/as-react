import React from 'react';
import { Modal } from 'antd';

import SoCascaderMulti from '../SoCascaderMulti';
import jsonp from 'jsonp';
import queryString from 'query-string';
import { querySpecialMdmCarModelTreeVoTree } from '../../services/getData'
const headerMap = {
    1: [{ title: '品牌', navField: 'initialsLetter' }],
    2: ['品牌',     '车系'],
    3: [{ title: '品牌', navField: 'initialsLetter' }, '车系', '车型'],
    4: [{ title: '品牌', navField: 'initialsLetter' }, '车系', '车款', '车型']

    // 1: ['品牌'],
    // 2: ['品牌',     '车系'],
    // 3: ['品牌', '车系', '车型'],
    // 4: ['品牌', '车系', '车款', '车型']
};

const requestConfig = [
    {
        params: 'brandCode',
        resultField: ['code', 'name'],
    },
    {
        params: 'seriesCode',
        resultField: ['code', 'name'],
    },
    {
        params: 'categoryCode',
        resultField: ['code', 'name'],
    },
];
export default class SoCarModelsSelect extends React.Component {
    static defaultProps = {
        disabled: false,
        allowClear: false,
        vehicleRange: ['SOUCHE'],
        searchPlaceholder: '请选择',
    };

    state = {
        options: [],
    };

    componentDidMount() {
        setTimeout(() => {
            this._requestCarBrand();
        }, 500);
    }

    _requestCarBrand() {
        querySpecialMdmCarModelTreeVoTree({brandCode:'',seriesCode:'',categoryCode:''}).then(res => {
            let options = res.data.map((obj, index) => ({
                ...obj,
                label: obj[requestConfig[0].resultField[1]],
                value: obj[requestConfig[0].resultField[0]],
                isLeaf: false,
            }));

            this.setState({
                options,
            });
        })
    }

    loadData = selectedOptions => {
        const selectedOptionsLen = selectedOptions.length;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        const { vehicleRange } = this.props;
        const nowRequest = requestConfig[selectedOptionsLen - 1];
        /**
         * brandCode 品牌
         * seriesCode 车系
         * categoryCode 车款
         */
        let reqParams = {}
        requestConfig.map((item,index) => {
            if(selectedOptions[index]){
                reqParams[item.params] = selectedOptions[index].value
            }else{
                reqParams[item.params] = ''
            }
        })
        querySpecialMdmCarModelTreeVoTree(reqParams).then(res => {
            if (!res.success) {
                Modal.error({ title: 'Error', content: res.msg });
                console.log(res.msg);
                return;
            }
            targetOption.loading = false;

            let child = [];

            res.data.map((obj, index) => {
                child[index] = {};
                child[index].label = obj[nowRequest.resultField[1]];
                child[index].value = obj[nowRequest.resultField[0]];

                // 车系的禁止选项
                if (
                    this.props.disabledCarSeriesCodes &&
                    this.props.level === 2
                ) {
                    this.props.disabledCarSeriesCodes.forEach(item => {
                        if (item === obj[nowRequest.resultField[0]]) {
                            child[index].disabled = true;
                        }
                    });
                }

                // 车型的禁止选项，原来是3级，现在变为4级
                if (
                    this.props.disabledCarModelCodes &&
                    this.props.level === 4
                ) {
                    this.props.disabledCarModelCodes.map(item => {
                        if (item === obj[nowRequest.resultField[0]]) {
                            child[index].disabled = true;
                        }
                    });
                }

                if (selectedOptionsLen.length + 1 === this.props.level) {
                    // 是否需要加载第三级数据
                    child[index].isLeaf = true;
                } else {
                    child[index].isLeaf = false;
                }
            });

            targetOption.children = child;

            this.setState({ options: [...this.state.options] });


        })
    };

    render() {
        const { options } = this.state;
        const { searchPlaceholder,level, ...otherProps} = this.props;

        return (
            <SoCascaderMulti
                {...otherProps}
                placeholder={searchPlaceholder}
                options={options}
                loadData={this.loadData}
                headers={headerMap[level] ? headerMap[level] : []}
            />
        );
    }
}
