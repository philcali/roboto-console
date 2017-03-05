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

  addQuery(name, value, raw) {
    if (!this.search[name]) {
      this.search[name] = [];
    }
    if (!raw) {
      value = encodeURIComponent(value);
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
          parts.push([key, value].join('='));
        });
      }
      baseUrl += parts.join('&');
    }
    return baseUrl;
  }
}
