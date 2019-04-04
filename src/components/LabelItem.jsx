//基础模块
import React from 'react';

const LabelItemClassName = 'label-item';

//所有Props
// props: {
//   label: 'string'
//   labelWidth: 'string': '100px'
//   labelGap: 'string': '5px'
// }

const LabelItem = props => {
  const className = (`${ LabelItemClassName } ` + (props.className || '')).trim();
  const labelWidth = props.labelWidth || '100px';
  const labelGap = props.labelGap || '5px';

  return (
    <div className={ className } style={ props.style }>
      <label 
        className={ `${ LabelItemClassName }__label` } 
        style={{ width: labelWidth }}
      >
        { props.label }
      </label>
      <div 
        className={ `${ LabelItemClassName }__content` } 
        style={{ 
          marginLeft: labelWidth, 
          paddingLeft: labelGap, 
        }}
      >
        { props.children }
      </div>
    </div>
  );
};

export default LabelItem;