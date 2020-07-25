class WindowEmitter {
  emit(event) {
    if (event in this) {
      this[event].forEach(callback => callback());
    }
  }

  listen(event, callback) {
    if (!(event in this)) {
      this[event] = [];
    }
    this[event].push(callback);
  }
}

const windowEmitter = new WindowEmitter();

const searchToObject = () => {
  const { search } = window.location;
  if (search === '') {
    return {};
  }
  const parts = search.substring(1).split('&');
  const obj = {};
  parts.forEach(part => {
    const [key, value] = part.split('=');
    obj[key] = value;
  });
  return obj;
};

const objectToString = obj =>
  Object.keys(obj)
    .reduce((acc, cur) => `${acc}&${cur}=${obj[cur]}`, '')
    .substr(1);

const addOrUpdateHash = (key, value) => {
  let obj;
  if (typeof key === 'object') {
    obj = {
      ...searchToObject(),
      ...key,
    };
  } else {
    obj = {
      ...searchToObject(),
      [key]: value,
    };
  }

  const newHash = objectToString(obj);
  window.history.replaceState(null, null, `?${newHash}`);
  windowEmitter.emit('change');
};

const removeFromHash = key => {
  const obj = searchToObject();
  delete obj[key];
  const newHash = objectToString(obj);
  window.history.replaceState(null, null, `?${newHash}`);
  windowEmitter.emit('change');
};

export { searchToObject, addOrUpdateHash, removeFromHash, objectToString, windowEmitter };
