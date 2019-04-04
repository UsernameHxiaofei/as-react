//基础模块
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

//第三方模块
import styled from 'styled-components';

//UI组件库
import { Table, Spin } from 'antd';

const Style = styled.div`
  .count-table__loading {
    text-align: center;
    padding: 30px 0;
  }

  .count-table__title > span {
    display: inline-block;
    padding: 0 10px;
    border-right: 3px solid #e8e8e8;
  }

  .count-table__title > span:last-child {
    border-right: none;
  }

  .count-table__body {
    margin-bottom: 10px;
  }

  .count-table__footer {
    display: table;
    width: 100%;
    border-radius: 4px;
    background-color: #e8e8e8;
  }

  .count-table__footer-cell {
    display: table-cell;
    padding: 8px 8px;
  }
`;


class CountTable extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    loading: PropTypes.bool,
    rowKey: PropTypes.string,
    footer: PropTypes.array,
    scroll: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
  };

  render () {
    const { data, columns, loading, rowKey, scroll, footer } = this.props;
    let [ loadingComponent, footerComponent ] = [ null, null ];

    if (loading) {
      loadingComponent = (
        <div className="count-table__loading">
          <Spin spinning tip="请稍后..." size="large" />
        </div>
      );
    };

    if (footer && data.length > 0) {
      footerComponent = (
        <div className="count-table__footer">
          {
            footer.map((item, index) => {
              let rowData = [];
              data.forEach(table => {
                table.dataSource.forEach(row => {
                  rowData.push(item.dataIndex ? row[ item.dataIndex ] : row);
                });
              });

              return (
                <div 
                  key={ index } 
                  className="count-table__footer-cell" 
                  style={{ 
                    width: typeof item.width === 'number' ? item.width + 'px' : item.width, 
                    textAlign: item.align, 
                  }}
                >
                  { item.render(rowData) }
                </div>
              )
            })
          }
        </div>
      );
    };

    return (
      <Style className="count-table">
        { loadingComponent }

        {
          data.map((table, index) => {
            let title = null;
            if (table.title) {
              title = () => (
                <div className="count-table__title">
                  {
                    table.title.map((item, i) => (<span key={ i }>{ item.label }：{ item.value }</span>))
                  }
                </div>
              );
            };

            return (
              <Table 
                className="count-table__body" 
                key={ index } 
                bordered 
                dataSource={ table.dataSource } 
                columns={ columns } 
                size="small" 
                rowKey={ rowKey } 
                scroll={ scroll } 
                title={ title }
                pagination={ false } 
              />
            );
          })
        }

      { footerComponent }
      </Style>
    );
  };
};

export default CountTable;