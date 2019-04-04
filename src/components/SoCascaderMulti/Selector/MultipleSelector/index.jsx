import React from 'react';
import Animate from 'rc-animate';

import { Consumer } from '../../context';

import generateSelector from '../../Base/BaseSelector';

import Selection from './Selection';

const Selector = generateSelector('multiple');
const SELECT_EMPTY_VALUE_KEY = 'SO_SELECT_EMPTY_VALUE_KEY';

@Consumer
class MultipleSelector extends React.Component {
    renderPlaceholder = () => {
        const { prefixCls, valueList, placeholder } = this.props;

        const hidden = valueList.length;

        return (
            <span
                style={{
                    display: hidden ? 'none' : 'block',
                }}
                className={`${prefixCls}-selection__placeholder`}>
                {placeholder}
            </span>
        );
    };

    renderSelection = () => {
        const {
            valueList,
            prefixCls,
            maxTagCount,
            maxTagPlaceholder,
            choiceTransitionName,
            onChoiceAnimationLeave,
            soCascaderMulti: { onMultipleSelectorRemove },
        } = this.props;

        let myValueList = valueList;
        if (maxTagCount >= 0) {
            myValueList = valueList.slice(0, maxTagCount);
        }

        const selectedValueNodes = myValueList.map(({ label, value }) => (
            <Selection
                {...this.props}
                key={value || SELECT_EMPTY_VALUE_KEY}
                label={label}
                value={value}
                onRemove={onMultipleSelectorRemove}
            />
        ));

        if (maxTagCount >= 0 && maxTagCount < valueList.length) {
            let content = `+ ${valueList.length - maxTagCount} ...`;

            if (typeof maxTagPlaceholder === 'string') {
                content = maxTagPlaceholder;
            } else if (typeof maxTagPlaceholder === 'function') {
                const restValueList = valueList.slice(maxTagCount);
                content = maxTagPlaceholder(restValueList);
            }

            const restNodeSelect = (
                <Selection
                    {...this.props}
                    key="rc-tree-select-internal-max-tag-counter"
                    label={content}
                    value={null}
                />
            );

            selectedValueNodes.push(restNodeSelect);
        }

        const className = `${prefixCls}-selection__rendered`;

        if (choiceTransitionName) {
            // 需要动画
            return (
                <Animate
                    className={className}
                    component="ul"
                    transitionName={choiceTransitionName}
                    onLeave={onChoiceAnimationLeave}>
                    {selectedValueNodes}
                </Animate>
            );
        }

        return (
            <ul className={`${prefixCls}-selection__rendered`} role="menubar">
                {selectedValueNodes}
            </ul>
        );
    };

    render() {
        return (
            <Selector
                {...this.props}
                tabIndex={-1}
                showArrow={false}
                renderPlaceholder={this.renderPlaceholder}
                renderSelection={this.renderSelection}
            />
        );
    }
}

export default MultipleSelector;
