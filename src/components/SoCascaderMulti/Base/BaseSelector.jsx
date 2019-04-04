import React from 'react';
import classNames from 'classnames';


import { Consumer } from '../context';

export default function(modeName) {
    @Consumer
    class BaseSelector extends React.Component {
        constructor(props) {
            super(props);

            this.domRef = React.createRef();
        }

        onFocus = (...args) => {
            const {
                onFocus,
                focused,
                soCascaderMulti: { onSelectorFocus },
            } = this.props;

            if (!focused) {
                onSelectorFocus();
            }

            if (onFocus) {
                onFocus(...args);
            }
        };

        onBlur = (...args) => {
            const {
                onBlur,
                soCascaderMulti: { onSelectorBlur },
            } = this.props;

            onSelectorBlur();

            if (onBlur) {
                onBlur(...args);
            }
        };

        focus = () => {
            this.domRef.current.focus();
        };

        blur = () => {
            this.domRef.current.focus();
        };

        renderClear() {
            const {
                prefixCls,
                allowClear,
                valueList,
                soCascaderMulti: { onSelectorClear },
            } = this.props;

            if (!allowClear || !valueList.length || !valueList[0].value) {
                return null;
            }

            return (
                <span key="clear" className={`${prefixCls}-selection__clear`}>
                    <i
                        className={classNames(
                            'so-icon-circle-plus',
                            `${prefixCls}-clear-icon`
                        )}
                        onClick={onSelectorClear}
                    />
                </span>
            );
        }

        renderArrow() {
            const { prefixCls, showArrow } = this.props;
            if (!showArrow) {
                return null;
            }

            return (
                <span
                    key="arrow"
                    className={`${prefixCls}-arrow`}
                    style={{ outline: 'none' }}>
                    <i
                        className={classNames(
                            'so-icon-arrow-down',
                            `${prefixCls}-arrow-icon`
                        )}
                    />
                </span>
            );
        }

        render() {
            const {
                prefixCls,
                className,
                style,
                open,
                onClick,
                tabIndex,
                focused,
                disabled,
                allowClear,
                renderSelection,
                renderPlaceholder,
            } = this.props;

            let myTabIndex = tabIndex;
            if (disabled) {
                myTabIndex = null;
            }

            return (
                <span
                    ref={this.domRef}
                    style={style}
                    onClick={onClick}
                    className={classNames(className, prefixCls, {
                        [`${prefixCls}-open`]: open,
                        [`${prefixCls}-focused`]: open || focused,
                        [`${prefixCls}-disabled`]: disabled,
                        [`${prefixCls}-enabled`]: !disabled,
                        [`${prefixCls}-allow-clear`]: allowClear,
                    })}
                    tabIndex={myTabIndex}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}>
                    <span
                        key="selection"
                        className={classNames(
                            `${prefixCls}-selection`,
                            `${prefixCls}-selection--${modeName}`
                        )}>
                        {renderSelection()}
                        {this.renderClear()}
                        {this.renderArrow()}

                        {renderPlaceholder && renderPlaceholder()}
                    </span>
                </span>
            );
        }
    }

    return BaseSelector;
}
