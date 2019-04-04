import createHistory from 'history/createHashHistory';

const history = createHistory();

function patch(_history) {
  const oldListen = _history.listen;
  _history.listen = (callback) => { // eslint-disable-line
    callback(_history.location);
    return oldListen.call(_history, callback);
  };
  return _history;
}

export default patch(history);
