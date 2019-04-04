import React from 'react';
import classNames from 'classnames';
import { debounce } from 'throttle-debounce';

import MenuItem from './MenuItem';

import { orderOptionsByLetter } from '../../utils';

function extraValueList(valueList = []) {
    return valueList.map(({ value }) => value);
}

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.menuBody = React.createRef();
        this.menuNav = React.createRef();
        this.state = {};
    }

    navOffsetTopList = [];

    static getDerivedStateFromProps(nextProps, prevState) {
        const { prevProps = {} } = prevState;

        const newState = {
            prevProps: nextProps,
        };

        if (
            prevProps.options !== nextProps.options ||
            prevProps.valueList !== nextProps.valueList
        ) {
            let selectValues = [];
            const valueList = nextProps.multiple
                ? nextProps.valueList
                : nextProps.valueList.slice(0, 1);
            const options = nextProps.options || [];

            newState.selectValues = selectValues = extraValueList(valueList);
            let selectLen = options.filter(({ value }) =>
                selectValues.includes(value)
            ).length;

            newState.checkAll = selectLen === options.length;

            newState.indeterminate =
                selectLen > 0 && selectLen < options.length;
        }

        if (prevProps.options !== nextProps.options) {
            const { headers, level, options } = nextProps;
            const { navField } = headers[level];
            let menuOptions = options,
                navList = [];
            if (navField) {
                [navList, menuOptions] = orderOptionsByLetter(
                    options,
                    navField
                );

                newState.navField = navField;
                newState.navList = navList;
            }
            newState.menuOptions = menuOptions;
        }

        return newState;
    }

    componentDidMount() {
        if (this.state.navField) {
            this.navOffsetTopList = this.collectNavScrollTop();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.navField && prevProps.options !== this.props.options) {
            this.navOffsetTopList = this.collectNavScrollTop();
        }
    }

    renderHeader = () => {
        const { prefixCls, headers, level } = this.props;
        const { navField } = this.state;
        const { title } = headers[level];
        return (
            <div
                className={classNames(`${prefixCls}-dropdown-menu__header`, {
                    [`${prefixCls}-dropdown-menu__header-nav`]: navField,
                })}>
                <span>{title}</span>
            </div>
        );
    };

    renderMenuList = () => {
        const { multiple, headers, level } = this.props;
        const {
            indeterminate,
            checkAll,
            selectValues,
            menuOptions,
        } = this.state;
        const isLast = level === headers.length - 1;

        const menuItems = menuOptions.map((option, index) => (
            <MenuItem
                {...this.props}
                key={option.value}
                option={option}
                index={index}
                checked={isLast && selectValues.includes(option.value)}
                onChange={this.onCheckedChange}
            />
        ));

        if (menuOptions.length && multiple && isLast) {
            const disabled =
                menuOptions.findIndex(({ disabled }) => disabled) > -1;
            menuItems.unshift(
                <MenuItem
                    {...this.props}
                    key="select-all"
                    indeterminate={indeterminate}
                    isSelectAll
                    checked={checkAll}
                    onChange={this.onCheckedChange}
                    option={{ label: '全选', disabled }}
                />
            );
        }

        return menuItems;
    };

    renderNavList = () => {
        const { prefixCls } = this.props;
        const { navList = [] } = this.state;

        return (
            <div
                ref={this.menuNav}
                className={`${prefixCls}-dropdown-menu__navList`}>
                {navList.map((nav, index) => (
                    <span
                        onClick={() => this.onAnchorChange(index)}
                        key={nav}
                        className={`${prefixCls}-dropdown-menu__navList--letter-normal`}>
                        {nav}
                    </span>
                ))}
            </div>
        );
    };

    renderNotice = () => {
        const { prefixCls, level, selectedValueChain, headers } = this.props;
        const { menuOptions } = this.state;
        const hiddenNotice = menuOptions.length;
        const chainLen = selectedValueChain.length;

        return (
            <span
                className={`${prefixCls}-dropdown-menu__notice`}
                style={{ display: hiddenNotice ? 'none' : 'block' }}>
                {!level ? '暂无数据' : `请选择${headers[chainLen].title}`}
            </span>
        );
    };

    renderBody = () => {
        const { prefixCls } = this.props;
        const { navField } = this.state;

        return (
            <div className={`${prefixCls}-dropdown-menu__body`}>
                {navField && this.renderNavList()}

                <div
                    ref={this.menuBody}
                    onScroll={this.onMenuBodyScroll}
                    className={`${prefixCls}-dropdown-menu__content`}>
                    {this.renderNotice()}
                    {this.renderMenuList()}
                </div>
            </div>
        );
    };

    onCheckedChange = (e, extra) => {
        const { onChange } = this.props;
        const { option } = extra;

        if (option.disabled) return;

        onChange && onChange(e, extra);
    };

    onAnchorChange = index => {
        const { prefixCls } = this.props;

        const menuBody = this.menuBody.current;

        if (index !== undefined) {
            let letterDOM = menuBody.querySelectorAll(
                `.${prefixCls}-dropdown-menu__item--nav`
            )[index];
            menuBody.scrollTop =
                letterDOM.offsetTop - letterDOM.clientHeight - 2;
        } else {
            menuBody.scrollTop = 0;
        }
    };

    debounceMenuBodyScroll = debounce(300, () => {
        const { navField } = this.state;
        if (!navField) return;

        const menuBodyDOM = this.menuBody.current;

        let menuClientHeight = menuBodyDOM.clientHeight;
        let currentTop = menuBodyDOM.scrollTop;

        let currentBottom = menuBodyDOM.scrollHeight - currentTop;

        // 滚动小于第一个元素高度
        if (currentTop < this.navOffsetTopList[0]) {
            this.markLetterStyle();
            return;
        }

        if (currentBottom <= menuClientHeight) {
            //滚动位置在最后位置
            this.markLetterStyle(this.navOffsetTopList.length - 1);
            return;
        }

        this.navOffsetTopList.find((item, index) => {
            if (
                currentTop >= item &&
                currentTop < this.navOffsetTopList[index + 1]
            ) {
                this.markLetterStyle(index);
                return null;
            }
        });
    });

    onMenuBodyScroll = e => {
        this.debounceMenuBodyScroll();
    };

    collectNavScrollTop = () => {
        const { prefixCls } = this.props;
        const letterList = this.menuBody.current.querySelectorAll(
            `.${prefixCls}-dropdown-menu__item--nav`
        );

        if (letterList.length) {
            let navItemHieght = letterList[0].clientHeight;

            return Array.from(letterList).map(
                item => item.offsetTop - navItemHieght - 2
            );
        }

        return [];
    };

    markLetterStyle = index => {
        if (!this.state.navField) return;

        if (index === undefined) {
            index = 0;
        }

        const { prefixCls } = this.props;

        let letterList = this.menuNav.current.querySelectorAll(
            `.${prefixCls}-dropdown-menu__navList span`
        );

        if (letterList.length) {
            Array.from(letterList).forEach(item => {
                item.classList.remove(
                    `${prefixCls}-dropdown-menu__navList--letter-selected`
                );
            });

            letterList[index] &&
                letterList[index].classList.add(
                    `${prefixCls}-dropdown-menu__navList--letter-selected`
                );
        }
    };

    render() {
        const { prefixCls } = this.props;

        return (
            <div className={`${prefixCls}-dropdown-menu`}>
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        );
    }
}
