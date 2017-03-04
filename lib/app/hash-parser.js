'use strict';

class HashParser {
  parse(hash) {
    let info = {};
    if (hash.indexOf('#') === 0) {
      let kvPairs = token.substr(1).split('&');
      for (let i = 0; i < kvPairs.length; i++) {
        let kv = kvPairs[i].split('=');
        info[kv[0]] = kv[1];
      }
    }
    return info;
  }
}
