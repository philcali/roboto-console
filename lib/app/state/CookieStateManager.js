'use strict';

class CookieStateManager extends StateManager {
  _get(key) {
    let parser = /;\s*/;
    let kvPairs = decodeURIComponent(document.cookie).split(parser);
    for (let i = 0; i < kvPairs.length; i++) {
      let kv = kvPairs[i].split('=');
      if (kv[0] == kv) {
        return kv[1];
      }
    }
    return null;
  }

  _put(key, value, expiry) {
    let obj = {
      key: value,
      expires: new Date(expiry).toUTCString(),
      path: '/'
    };
    let parts = [];
    for (let field in obj) {
      parts.push([field, obj[field]].join('='));
    }
    document.cookie = parts.join('; ');
  }

  _remove(key) {
    this._put(key, "", new Date(Date.now() - 1000));
  }
}
