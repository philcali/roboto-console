'use strict';

class LocalStorageStateManager extends StateManager {
  _get(key) {
    let data = localStorage.getItem(key);
    if (data) {
      let expiry = localStorage.getItem(key + STATE_EXPIRE_SUFFIX);
      if (!expiry || (expiry && parseInt(expiry) > Date.now())) {
        return data;
      } else {
        this._remove(key);
      }
    }
    return null;
  }

  _put(key, value, expiry) {
    localStorage.setItem(key, value);
    localStorage.setItem(key + STATE_EXPIRE_SUFFIX, expiry);
  }

  _remove(key) {
    localStorage.removeItem(key);
    localStorage.removeItem(key + STATE_EXPIRE_SUFFIX);
  }

  isCompatible() {
    return localStorage || false;
  }
}
