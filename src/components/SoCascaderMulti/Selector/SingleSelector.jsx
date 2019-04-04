import React from 'react';
import generateSelector from '../Base/BaseSelector';

const Selector = generateSelector('single');

class SingleSelector extends React.Component {
    constructor() {
        super();
        this.selectorRef = React.createRef();
    }

    focus = () => {
        this.selectorRef.current.focus();
    };
    blur = () => {
        this.selectorRef.current.blur();
    };

    renderSelection = () => {
        const { valueList, placeholder, prefixCls } = this.props;

        let innerNode;

        if (valueList.length) {
            const { label, value } = valueList[0];
            innerNode = (
                <span
                    key="value"
                    title={label}
                    className={`${prefixCls}-selection-selected-value`}>
                    {label || value}
                </span>
            );
        } else {
            innerNode = (
                <span
                    key="placeholder"
                    className={`${prefixCls}-selection__placeholder`}>
                    {placeholder}
                </span>
            );
        }

        return (
            <span className={`${prefixCls}-selection__rendered`}>
                {innerNode}
            </span>
        );
    };

    render() {
        return (
            <Selector
                {...this.props}
                ref={this.selectorRef}
                renderSelection={this.renderSelection}
            />
        );
    }
}

export default SingleSelector;
