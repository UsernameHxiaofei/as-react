import { createModel } from '@rematch/core';
const initState = Object.freeze({
  dataSource: [
    {
      key: '1',
      name: '胡彦斌1',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖2',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖3',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '4',
      name: '胡彦祖4',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '5',
      name: '胡彦祖5',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '6',
      name: '胡彦祖6',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '7',
      name: '胡彦祖7',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '8',
      name: '胡彦祖8',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '9',
      name: '胡彦祖9',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '10',
      name: '胡彦祖10',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '11',
      name: '胡彦祖11',
      age: 42,
      address: '西湖区湖底公园1号'
    }
  ],
  dataSourceRight: [
    {
      key: '1',
      name: '胡彦斌1',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖2',
      age: 42,
      address: '西湖区湖底公园1号'
    },
    {
      key: '3',
      name: '胡彦祖3',
      age: 42,
      address: '西湖区湖底公园1号'
    }
  ],
  listLoading: false
});
export default createModel({
  name: 'ClientBoard',
  state: {
    ...initState
  },
  effects: {},
  reducers: {
    RESET_STATE(state, payload) {
      return { ...initState };
    },
    SET_STATE(state, payload) {
      for (const key in payload) state[key] = payload[key];
    }
  }
});
