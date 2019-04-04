//基础模块
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


class moban extends PureComponent {
  static propTypes = {
    string: PropTypes.string,
    number: PropTypes.number,
    bool: PropTypes.bool,
    array: PropTypes.array,
    object: PropTypes.object,
    func:  PropTypes.func,
    isRequired: PropTypes.isRequired,// 必填
    stringIsRequired: PropTypes.string.isRequired,
    any: PropTypes.any,// 任意类型的数据
    node: PropTypes.node, //任何可被渲染的元素（包括数字、字符串、子元素或数组）
    element: PropTypes.element, // 一个 React 元素
    optionalMessage: PropTypes.instanceOf(Message),// 你也可以声明属性为某个类的实例，这里使用 JS 的instanceof 操作符实现。
    oneOf: PropTypes.oneOf(['News', 'Photos']),// 你也可以限制你的属性值是某个特定值之一
    oneOfType: PropTypes.oneOfType([ // 限制它为列举类型之一的对象
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Message)
    ]),
    arrayOf: PropTypes.arrayOf(PropTypes.number),// 一个指定元素类型的数组
    objectOf: PropTypes.objectOf(PropTypes.number),// 一个指定类型的对象
    objectWithShape: PropTypes.shape({// 一个指定属性及其类型的对象
      color: PropTypes.string,
      fontSize: PropTypes.number
    }),
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
  };

  render () {
    const { className, style } = this.state;

    return (
      <div className={ ('moban ' + className).trim() } style={ style }>
        
      </div>
    );
  };
};