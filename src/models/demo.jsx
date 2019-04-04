export default {
  state: {
    todos: [],
    tabsList:[{title: '首页',content: '首页',key: '0',closable: false},],
    selectedKeys:[],
    activeKey:'0',
    tentantID:''
  },
  reducers: {
    SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] !== 'undefined') {
          state[key] = payload[key];
        }
      });
    },
    ADD_TODO(state, payload) {
      state.todos.push({
        title: payload,
        done: false,
      });
    },
    TOGGLE_TODO(state, payload) {
      state.todos[payload].done = !state.todos[payload].done;
    },
    DELETE_TODO(state, payload) {
      state.todos.splice(payload, 1);
    },
    ADD_TABLIST(state, payload) {

    	// console.log(state, payload,"加")
     const panes = state.tabsList;
		 state.selectedKeys=[payload.index]
	 	let exist = false
				for(let i = 0; i < panes.length; i++) {
					if(payload.name == panes[i].title) {
						exist = true
						break
					}
				}
				if(exist == true) {
					state.activeKey = payload.index;
					return
				}
	    state.activeKey = payload.index;
	    panes.push({ title: payload.name, content: payload.component, key: state.activeKey });
    },
    ACTIVECHANGE(state, payload) {
    	state.activeKey = payload;
    	state.selectedKeys = [payload]
    },
    REMOVE_TABSLIST(state,payload) {
    	let activeKey = state.activeKey;
		 	let lastIndex;
		 	state.tabsList.forEach((pane, i) => {
		 		if(pane.key === payload) {
		 			lastIndex = i - 1;
		 		}
		 	});
		 	const tabsList = state.tabsList.filter(pane => pane.key !== payload);
		 	if(lastIndex >= 0 && activeKey === payload) {
		 			activeKey = tabsList[lastIndex].key;
		 	}
		 	state.tabsList = tabsList
		 	state.activeKey = activeKey
		 	state.selectedKeys=[ tabsList[lastIndex].key]

    }
  },
};
