class Store {
  refreshRate = 60;

  constructor() {
    this.refreshInterval = setInterval(this.refreshFn, this.refreshRate * 1000);
  }

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

  refreshFn = () => {
    this.emit('refresh');
  };

  updateRefreshInterval = refresh => {
    this.refreshRate = refresh;
    clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(this.refreshFn, this.refreshRate * 1000);
  };
}

export default new Store();
