import React, { Component } from 'react';
import { connect } from 'react-redux';

//API
import {
  playMusic,

} from '@/services/getData';

import styled from 'styled-components';

// UI组件
import { Table, Icon, Spin } from 'antd';
const Root = styled.div`
  > * {
    margin: 0 auto;
  }
  .rightTitle {
    text-align: center;
    padding-top: 20px;
    margin-bottom: 20px;
  }
`;
const TableRender = styled.div`
  text-align: center;
  .ant-table td {
    white-space: nowrap;
  }
  .ant-table-pagination.ant-pagination {
    float: none;
  }
  .ant-table-thead {
    word-break: keep-all;
    white-space: nowrap;
  }
`;
class RightTable extends Component {


  playMusic = () => {
    const params = {
      "speechText": "你好百度",
      "orgId": "609ddac278454153a5d1fb73036584ad",
      "tentantId": "fcfd0fcca01947fe83b652e63abd882e"
    }
    playMusic(params).then(res => {
      console.log(res)
      if (res.success && res.code == 200) {
        const datas = res.data;
        /* 一 */
        // const fr = new FileReader();
        // try {
        // fr.readAsDataURL(data);
        // fr.onload = e => {
        let blob = new Blob([datas], { type: 'audio/*' });
        // 生成一个本地的blob url
        let blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);
        document.querySelector('audio').src = blobUrl;
        // new Audio(blobUrl).play(); 
        // }
        // } catch (e) {

        // }

        /* 二 */
        // var audioUrl = "data:audio/mp3;base64," + datas;
        // new Audio( audioUrl ).play();

      }

    })
  }

  controlMusic = () => {
    const audio = document.getElementById('audioNode');
    console.log(audio.paused);
    if (audio.paused) { //暂停
      audio.play();
    } else { //播放
      audio.pause();
    }
  }


  render() {
    const { dataSourceRight, tableClassName, listLoading } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      }
    ];
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    return (
      <Root>
        <h3 className='rightTitle'>请以下车主取车</h3>
        <Spin spinning={listLoading} indicator={antIcon} tip='加载中'>
          <TableRender>
            <Table
              bordered
              className={tableClassName}
              dataSource={dataSourceRight}
              columns={columns}
              pagination={false}
              style={{ width: '80%', marginLeft: '10%' }}
            />

            {/* <audio src={require('@/static/123.mp3')} controls loop id='audioNode'>音乐播放器</audio> */}
            {/* <audio className='audio - node'>语音播报</audio> */}
            <div onClick={this.controlMusic} style={{ marginTop: '10px' }}>开始/暂停</div>
          </TableRender>

        </Spin>
      </Root>
    );
  }
}
const mapStateToProps = state => {
  const { dataSourceRight, listLoading } = state.ClientBoard;
  return { dataSourceRight, listLoading };
};

const mapDispatchToProps = dispatch => {
  const { SET_STATE } = dispatch.ClientBoard;
  return { SET_STATE };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightTable);
