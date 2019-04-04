//基础模块
import React from 'react';

//文字按钮的ClassName
const textButtonClassName = 'text-button';

//文字颜色类型
const colorType = {
  primary: 'primary',
  success: 'success',
  danger: 'danger',
};

//返回文字按钮的类型
const typeClass = (type, color) => {
  if (color) return '';
  switch (type) {
    case colorType.primary:
      type = colorType.primary;
      break;

    case colorType.success:
      type = colorType.success;
      break;

    case colorType.danger:
      type = colorType.danger;
      break;

    default: 
      type = colorType.primary;
      break;
  };

  return `${ textButtonClassName }--${ type }`;
};


const TextButton = (props = {}) => {
  let className = `
    ${ textButtonClassName }
     ${ typeClass(props.type, props.color) }
     ${ props.className || '' }
  `;

  return (
    <button 
      { ...props }
      className={ className.trim() } 
      style={{ color: props.color || '', ...props.style }}
    >
      { props.children }
    </button>
  )
};

export default TextButton;