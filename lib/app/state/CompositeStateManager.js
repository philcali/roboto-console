'use strict';

class CompositeStateManager extends StateManager {
  constructor(managers) {
    super();
    this.managers = managers;
  }

  _get(key) {
    let value = null;
    this.each(manager => {
      value = manager._get(key);
    });
    return value;
  }

  _put(key, value, expiry) {
    this.each(manager => manager._put(key, value, expiry));
  }

  _remove(key) {
    this.each(manager => manager._remove(key));
  }

  compatible(manager) {
    return manager.isCompatible();
  }

  each(thunk) {
    this.managers.filter(this.compatible).forEach(thunk);
  }
}
