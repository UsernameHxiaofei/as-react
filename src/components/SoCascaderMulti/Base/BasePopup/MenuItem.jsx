import React from 'react';
import { Checkbox } from '@souche-ui/so-ui-react';
// import Checkbox from '../../Checkbox';
import classNames from 'classnames';

export default function MenuItem(props) {
    const {
        multiple,
        prefixCls,
        isSelectAll,
        onChange,
        headers,
        level,
        option,
        index,
        checked,
        indeterminate,
        selectedValueChain,
    } = props;

    const isLast = level === headers.length - 1;
    const levelValue =
        (selectedValueChain[level] && selectedValueChain[level].value) || '';

    if (multiple && isLast) {
        let checkedState = { checked };
        if (isSelectAll) {
            checkedState.indeterminate = indeterminate;
        }

        return (
            <span
                className={classNames(`${prefixCls}-dropdown-menu__item`, {
                    [`${prefixCls}-dropdown-menu__item--disabled`]: option.disabled,
                })}>
                <Checkbox
                    // prefixCls={prefixCls}
                    onChange={e =>
                        onChange(e, {
                            option,
                            level,
                            isSelectAll,
                            isLast,
                            index,
                        })
                    }
                    disabled={option.disabled}
                    {...checkedState}>
                    {option.label}
                </Checkbox>
            </span>
        );
    } else {
        return (
            <span
                className={classNames(`${prefixCls}-dropdown-menu__item`, {
                    [`${prefixCls}-dropdown-menu__item--selected `]:
                        option.value === levelValue || checked,
                    [`${prefixCls}-dropdown-menu__item--disabled `]: option.disabled,
                    [`${prefixCls}-dropdown-menu__item--loading `]: option.loading,
                    [`${prefixCls}-dropdown-menu__item--nav`]: option.isNavFieldItem,
                })}
                onClick={e => onChange(e, { option, level, isLast, index })}>
                {option.label}
                {option.loading && (
                    <span
                        key="loadig-icon"
                        className={`${prefixCls}-dropdown-menu__item--loading--icon `}>
                        <i className="so-icon-loading" />
                    </span>
                )}
            </span>
        );
    }
}
