'use strict';

class EventManager {
  constructor() {
    this.handlers = {};
  }

  on(name, thunk) {
    if (!this.handlers[name]) {
      this.handlers[name] = [];
    }
    if (this._find(name, thunk) === -1) {
      this.handlers[name].push(thunk);
    }
    return this;
  }

  off(name, thunk) {
    let index = this._find(name, thunk);
    if (index > -1) {
      this.handlers[names].splice(index, 1);
    }
    return this;
  }

  emit(name, data) {
    (this.handlers[name] || []).forEach(h => h(data));
  }

  _find(name, thunk) {
    let index = -1;
    for (let i = 0; i < this.handlers[name].length; i++) {
      if (thunk === this.handlers[name]) {
        index = i;
        break;
      }
    }
    return index;
  }
}
