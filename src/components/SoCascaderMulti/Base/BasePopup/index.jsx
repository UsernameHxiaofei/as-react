import React from 'react';

import Menu from './Menu';
import { Consumer } from '../../context';

@Consumer
class BasePopup extends React.Component {
    state = {
        selectedValueChain: [],
    };

    setupSelectedValueChain = (level, option) => {
        const { selectedValueChain } = this.state;
        const nextSelectedValueChain = selectedValueChain.slice(0, level);
        nextSelectedValueChain[level] = option;
        return nextSelectedValueChain;
    };

    // 主要是每级选中后的效果
    handleItemSelect = (e, extra) => {
        const { option, level, isLast } = extra;
        const {
            loadData,
            soCascaderMulti: { onCascaderNodeSelect },
        } = this.props;

        if (option.disabled) return;

        const { selectedValueChain } = this.state;
        let nextSelectedValueChain = selectedValueChain.slice();

        if (!isLast) {
            // 这里要防止重复点击
            if (
                selectedValueChain[level] &&
                selectedValueChain[level].value === option.value
            )
                return;

            nextSelectedValueChain = this.setupSelectedValueChain(
                level,
                option
            );

            this.setState({
                selectedValueChain: nextSelectedValueChain,
            });

            onCascaderNodeSelect(e, {
                ...extra,
                selectedOptions: nextSelectedValueChain,
            });

            if (option.isLeaf === false && !option.children && loadData) {
                loadData(nextSelectedValueChain);
                return;
            }
        } else {
            // 最后一级选中情况
            this.handleItemCheck(e, extra, nextSelectedValueChain);
        }
    };

    handleItemCheck = (e, extra, selectedValueChain) => {
        const {
            soCascaderMulti: { onCascaderNodeCheck },
            options: originOptions,
        } = this.props;
        const { isSelectAll, option, level } = extra;

        let options;
        if (isSelectAll) {
            options =
                level === 0
                    ? originOptions
                    : selectedValueChain.slice(-1)[0].children;
        } else {
            options = [option];
        }

        onCascaderNodeCheck(e, { ...extra, options });
    };

    genMenus = () => {
        const { selectedValueChain } = this.state;
        const {
            headers,
            prefixCls,
            isMultiple,
            valueList,
            options,
        } = this.props;

        return headers.map((header, index) => {
            let optionsPool;

            if (index > 0) {
                // 这里利用了对象引用
                const lastSelectOption = selectedValueChain[index - 1];
                optionsPool =
                    (lastSelectOption && lastSelectOption.children) || [];
            }

            return (
                <Menu
                    valueList={valueList}
                    key={index}
                    level={index}
                    headers={headers}
                    multiple={isMultiple}
                    prefixCls={prefixCls}
                    options={index === 0 ? options : optionsPool}
                    onChange={this.handleItemSelect}
                    selectedValueChain={selectedValueChain}
                />
            );
        });
    };

    render() {
        const { prefixCls } = this.props;

        return (
            <div className={`${prefixCls}-dropdown__group`}>
                {this.genMenus()}
            </div>
        );
    }
}

export default BasePopup;
