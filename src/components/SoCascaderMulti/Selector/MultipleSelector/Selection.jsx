import React from 'react';
import classNames from 'classnames';

const UNSELECTABLE_STYLE = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
    unselectable: 'unselectable',
};

class Selection extends React.Component {
    onRemove = event => {
        const { onRemove, value, disabled } = this.props;

        if (disabled) return;

        onRemove && onRemove(event, value);

        event.stopPropagation();
    };

    render() {
        const {
            prefixCls,
            maxTagTextLength,
            label,
            value,
            onRemove,
        } = this.props;

        let content = label || value;

        if (
            maxTagTextLength &&
            typeof content === 'string' &&
            content.length > maxTagTextLength
        ) {
            content = `${content.slice(0, maxTagTextLength)}...`;
        }

        return (
            <li
                style={UNSELECTABLE_STYLE}
                {...UNSELECTABLE_ATTRIBUTE}
                className={`${prefixCls}-selection__choice`}
                title={content}>
                {onRemove && (
                    <span
                        className={`${prefixCls}-selection__choice__remove`}
                        onClick={this.onRemove}>
                        <i
                            className={classNames(
                                'so-icon-close',
                                `${prefixCls}-remove-icon`
                            )}
                        />
                    </span>
                )}
                <span className={`${prefixCls}-selection__choice__content`}>
                    {content}
                </span>
            </li>
        );
    }
}

export default Selection;
