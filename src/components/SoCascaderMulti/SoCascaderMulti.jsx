import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from './context';

import MultipleSelector from './Selector/MultipleSelector';
import SingleSelector from './Selector/SingleSelector';
import SelectTrigger from './SelectTrigger';
import Popup from './Popup';

import {
    convertOptionToEntities,
    genrateValueListTree,
    formatHeaders,
} from './utils';
import '@souche-ui/so-ui-react/dist/styles/index.css';
import './style/index.less';

export default class SoCascaderMulti extends React.Component {
    static defaultProps = {
        prefixCls: 'so-cascader-multi',
        showArrow: true,
        placeholder: 'please select',
        choiceTransitionName: 'zoom',
        transitionName: 'slide-up',
    };

    static propTypes = {
        prefixCls: PropTypes.string,
        multiple: PropTypes.bool,
        showArrow: PropTypes.bool,
        open: PropTypes.bool,
        autoFocus: PropTypes.bool,
        defaultOpen: PropTypes.bool,
        headers: PropTypes.array,

        value: PropTypes.array,
        defaultValue: PropTypes.array,

        placeholder: PropTypes.node,
        disabled: PropTypes.bool,

        maxTagCount: PropTypes.number,
        maxTagPlaceholder: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.func,
        ]),
        maxTagTextLength: PropTypes.number,

        options: PropTypes.array,
        loadData: PropTypes.func,
        onChange: PropTypes.func,
        onDropdownVisibleChange: PropTypes.func,
    };

    constructor(props) {
        super(props);

        const { open, defaultOpen } = props;

        this.state = {
            open: open || defaultOpen,
            valueList: [],
            missValueList: [], // 可能通过异步加载出来的
            valueEntities: {},
            posEntities: {},

            init: false,
        };

        this.selectorRef = React.createRef();
        this.selectTriggerRef = React.createRef();

        this.soCascaderMulti = {
            onSelectorFocus: this.onSelectorFocus,
            onSelectorBlur: this.onSelectorBlur,
            onSelectorClear: this.onSelectorClear,
            onCascaderNodeSelect: this.onCascaderNodeSelect,
            onCascaderNodeCheck: this.onCascaderNodeCheck,
            onMultipleSelectorRemove: this.onMultipleSelectorRemove,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { prevProps = {} } = prevState;

        const newState = {
            prevProps: nextProps,
            init: true,
        };

        function processState(propName, updater) {
            if (prevProps[propName] !== nextProps[propName]) {
                updater(nextProps[propName], prevProps[propName]);
                return true;
            }
            return false;
        }

        processState('open', propValue => {
            newState.open = propValue;
        });

        let valueRefresh = false;
        let cascaderOptions;

        processState('options', propValue => {
            cascaderOptions = propValue;
        });

        if (cascaderOptions) {
            const entitiesMap = convertOptionToEntities(cascaderOptions);
            newState.posEntities = entitiesMap.posEntities;
            newState.valueEntities = entitiesMap.valueEntities;
            // console.log(entitiesMap);
        }

        // debugger;

        if (!prevState.init) {
            processState('defaultValue', propValue => {
                newState.valueList = propValue;
            });

            valueRefresh = true;
        }

        processState('value', propValue => {
            newState.valueList = propValue;
            valueRefresh = true;
        });

        if (valueRefresh) {
            const missValueList = [];

            let latestValueList = newState.valueList;

            if (!latestValueList) {
                latestValueList = [...prevState.valueList];
            }

            latestValueList.forEach(wrapperValue => {
                const { value } = wrapperValue;
                const entity = (newState.valueEntities ||
                    prevState.valueEntities)[value];

                if (!entity) {
                    missValueList.push(wrapperValue);
                }
            });

            newState.missValueList = missValueList;
        }

        return newState;
    }

    componentDidMount() {
        const { autoFocus, disabled } = this.props;

        if (autoFocus && !disabled) {
            this.focus();
        }
    }

    componentDidUpdate(_, prevState) {
        if (prevState.valueList !== this.state.valueList) {
            this.forcePopupAlign();
            this.selectionScroll2Bottom();
        }
    }

    // Selector
    onMultipleSelectorRemove = (event, removeValue) => {
        event.stopPropagation();
        const { valueList, missValueList, valueEntities } = this.state;
        const { disabled } = this.props;

        if (disabled) return;

        const triggerEntity = valueEntities[removeValue];
        const triggerNode = triggerEntity ? triggerEntity.node : null;

        const extraInfo = {
            triggerValue: removeValue,
            triggerNode,
        };

        const newValueList = valueList
            .slice()
            .filter(({ value }) => value !== removeValue);

        const newMissValueList = missValueList.filter(
            ({ value }) => value !== removeValue
        );

        this.setState({ valueList: newValueList });

        this.triggerChange(newMissValueList, newValueList, extraInfo);
    };

    onSelectorFocus = () => {
        this.setState({ focused: true });
    };

    onSelectorBlur = () => {
        this.setState({ focused: false });
    };

    onSelectorClear = event => {
        const { disabled } = this.props;
        if (disabled) return;

        this.triggerChange([], []);
        event.stopPropagation();
    };

    selectionScroll2Bottom = () => {
        const { open } = this.state;
        if (!open) return;
        const selectionWrapper = document.querySelector(
            '.so-cascader-multi-selection'
        );

        if (selectionWrapper) {
            const elScrollHeight = selectionWrapper.scrollHeight;
            selectionWrapper.scrollTop = elScrollHeight;
        }
    };

    // Popup

    onCascaderNodeSelect = (e, extraInfo) => {};
    // 选择框选择后结果
    onCascaderNodeCheck = (e, extra) => {
        const { valueList, missValueList } = this.state;
        const { multiple } = this.props;
        const isChecked = e.target.checked;
        const { options } = extra;
        let nextValueList = [];

        if (multiple && isChecked) {
            // 点击
            const newOptions = options.map(({ label, value }) => ({
                label,
                value,
            }));
            let valueMap = {};

            nextValueList = [...valueList, ...newOptions].filter(
                ({ value }) => {
                    if (!valueMap[value]) {
                        return (valueMap[value] = true);
                    }
                }
            );
        } else if (!multiple) {
            this.setOpenState(false);
            nextValueList = [options[0]];
        } else {
            nextValueList = valueList.filter(({ value }) => {
                return (
                    options.findIndex(option => value === option.value) === -1
                );
            });
        }

        this.triggerChange(missValueList, nextValueList);
    };

    // trigger
    triggerChange = (missValueList, valueList, extraInfo = {}) => {
        const { valueEntities, posEntities } = this.state;
        const { onChange, disabled } = this.props;
        if (disabled) return;

        if (!('value' in this.props)) {
            const newState = {
                missValueList,
                valueList,
            };

            this.setState(newState);
        }

        if (onChange) {
            let returnValue;

            if (this.isMultiple) {
                returnValue = valueList;
            } else {
                returnValue = valueList[0];
            }

            const extra = {
                ...extraInfo,
                valueListTree: genrateValueListTree(
                    returnValue,
                    valueEntities,
                    posEntities
                ),
                missValueList: missValueList, // 可能异步的数据
            };

            onChange(returnValue, extra);
        }
    };

    onDropdownVisibleChange = open => {
        this.setOpenState(open, true);
    };

    onChoiceAnimationLeave = () => {
        this.forcePopupAlign();
    };

    setUncontrolledState = state => {
        let needSync = false;
        const newState = {};

        Object.keys(state).forEach(name => {
            if (name in this.props) return;

            needSync = true;
            newState[name] = state[name];
        });

        if (needSync) {
            this.setState(newState);
        }

        return needSync;
    };

    setOpenState = (open, byTrigger = false) => {
        const { onDropdownVisibleChange } = this.props;

        if (
            onDropdownVisibleChange &&
            onDropdownVisibleChange(open, {
                documentClickClose: !open && byTrigger,
            }) === false
        ) {
            return;
        }

        this.setUncontrolledState({ open });
    };

    isMultiple = () => {
        // 是否多选
        const { multiple } = this.props;
        return !!multiple;
    };

    forcePopupAlign = () => {
        const $trigger = this.selectTriggerRef.current;

        if ($trigger) {
            $trigger.forcePopupAlign();
        }
    };

    focus() {
        this.selectorRef.current.focus();
    }

    blur() {
        this.selectorRef.current.blur();
    }

    render() {
        const { prefixCls, disabled, headers } = this.props;
        const { valueList, open, focused } = this.state;

        const isMultiple = this.isMultiple();
        const passProps = {
            ...this.props,
            headers: formatHeaders(headers),
            isMultiple,
            valueList,
            open,
            disabled,
            focused,
            dropdownPrefixCls: `${prefixCls}-dropdown`,
            onNodeCheck: this.onNodeCheck,
            onChoiceAnimationLeave: this.onChoiceAnimationLeave,
        };

        const Selector = isMultiple ? MultipleSelector : SingleSelector;
        const $popup = <Popup {...passProps} />;
        const $selector = <Selector {...passProps} ref={this.selectorRef} />;

        return (
            <Provider store={this.soCascaderMulti}>
                <SelectTrigger
                    {...passProps}
                    ref={this.selectTriggerRef}
                    popupElement={$popup}
                    onDropdownVisibleChange={this.onDropdownVisibleChange}>
                    {$selector}
                </SelectTrigger>
            </Provider>
        );
    }
}
