import React, { Component } from 'react';
import { fromJS, is } from 'immutable';
import { Form, InputNumber, Input, Popover, Button, Row, Col, Dropdown } from 'antd';
import styled from 'styled-components';
import * as _ from 'lodash';
import { BatchActionDropdownForm } from './BatchActionDropdown';

const EditableContext = React.createContext();
const EditableHeaderRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableHeaderFormRow = Form.create()(EditableHeaderRow);

class EditableHeaderCell extends Component {
    static defaultProps = {
      headerOption: {
      },
    };
    constructor(props) {
      super(props);
      this.state = {
        isDropdownMenuVisible: false,
      };
    }

  handleCloseDropdown = (isDropdownMenuVisible, resolve) => {
    this.setState({ isDropdownMenuVisible }, () => resolve(true));
  };
  handleSubmit = () => {
    this.setState({ isDropdownMenuVisible: false });
  };
  render() {
    const { isDropdownMenuVisible } = this.state;
    const {
      dropDownTitle, propName, headerOption, headerOption: {
        otherAction, range, rules, inputType, step, ...headerOptionRestProps
      }, className, ...restProps
    } = this.props;
    const { actionType = 'batchOperation' } = headerOption || {};
    const menus = (
      <BatchActionDropdownForm
        onSubmit={this.handleSubmit}
        isDropdownMenuVisible={isDropdownMenuVisible}
        onCloseDropdown={this.handleCloseDropdown}
        otherAction={otherAction}
        range={range}
        rules={rules}
        step={step}
        propName={propName}
        inputType={inputType}
        {...headerOptionRestProps}
      />
    );
    return (
      <th className={className}>
        {actionType && inputType ? (
          <EditableContext.Consumer>
            {(form) => {
              switch (actionType) {
                case 'batchOperation': {
                  return (
                    <div>
                      <span style={{ float: 'left', marginTop: '1px' }}>{dropDownTitle}</span>
                      <span style={{ float: 'right' }}>
                        <Dropdown
                          trigger={['click']}
                          placement='topRight'
                          forceRender
                          title={dropDownTitle}
                          overlay={menus}
                          visible={isDropdownMenuVisible}
                          onVisibleChange={this.onVisibleChange}
                        >
                          <Button
                            size='small'
                            onClick={() => this.setState({ isDropdownMenuVisible: true })}
                          >
                            批量
                          </Button>
                        </Dropdown>
                      </span>
                    </div>
                  );
                }
                default:
                  return <div style={{ textAlign: 'center' }}>{restProps.children}</div>;
              }
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </th>
    );
  }
}

export { EditableHeaderFormRow, EditableHeaderCell };
