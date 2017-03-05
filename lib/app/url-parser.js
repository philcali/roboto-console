'use strict';

class URLParser {
  constructor(initial) {
    this.initial = initial || '?';
  }

  parse(url) {
    let info = {};
    if (url.indexOf(this.initial) === 0) {
      let kvPairs = url.substr(this.initial.length).split('&');
      for (let i = 0; i < kvPairs.length; i++) {
        let kv = kvPairs[i].split('=');
        info[kv[0]] = decodeURIComponent(kv[1]);
      }
    }
    return info;
  }
}
