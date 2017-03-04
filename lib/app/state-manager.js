'use strict';

const STATE_EXPIRE_SUFFIX = "_ex_in";

class StateManager {
  constructor() {
  }

  getItem(key) {
    return this._get(key);
  }

  _get(key) {
    throw new Error("Get implementation was not implemented.");
  }

  putItem(key, value, expiry) {
    this._put(key, value, Date.now() + (expiry * 1000));
  }

  _put(key, value, expiry) {
    throw new Error("Put implementation was not implemented.");
  }

  removeItem(key) {
    this._remove(key);
  }

  _remove(key) {
    throw new Error("Del implementation was not implemented.");
  }

  isCompatible() {
    return true;
  }
}
