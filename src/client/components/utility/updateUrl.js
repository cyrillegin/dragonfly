const updateUrl = (key, value, callback = () => {}) => {
  const curSearch = {};
  if (window.location.hash.length > 1) {
    window.location.hash
      .split('#')[1]
      .split('&')
      .forEach(e => {
        curSearch[e.split('=')[0]] = e.split('=')[1];
      });
  }

  curSearch[key] = value;

  let newSearch = '#';
  Object.keys(curSearch).forEach((searchKey, index) => {
    if (index > 0) {
      newSearch += '&';
    }
    newSearch += searchKey + '=' + curSearch[searchKey];
  });
  window.location.hash = newSearch;
  callback();
};

export default updateUrl;
