'use strict';

class URLBuilder {
  constructor(options) {
    this.options = options || {};
    this.paths = this.options.paths || [];
    this.search = this.options.search || {};
    this.hasSearch = this.options.search;
  }

  setBaseUrl(baseUrl) {
    this.options.baseUrl = baseUrl;
    return this;
  }

  addPath(part) {
    this.paths.push(part);
    return this;
  }

  addQuery(name, value) {
    if (!this.search[name]) {
      this.search[name] = [];
    }
    this.search[name].push(value);
    this.hasSearch = true;
    return this;
  }

  build() {
    let baseUrl = this.options.baseUrl;
    if (this.paths.length > 0) {
      baseUrl += '/' + this.paths.join('/');
    }
    if (this.hasSearch) {
      baseUrl += '?';
      let parts = [];
      for (let key in this.search) {
        this.search[key].forEach(value => {
          parts.push([
            encodeURIComponent(key),
            encodeURIComponent(value)
          ].join('='));
        });
      }
      baseUrl += parts.join('&');
    }
    return baseUrl;
  }
}
