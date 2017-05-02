'use strict';

class Template {
  constructor(id) {
    this.node = $('#' + id).clone().removeClass('template');
    this.custom = {};
  }

  transform(key, thunk) {
    this.custom[key] = thunk;
    return this;
  }

  replace(obj) {
    let html = this.node.html();
    for (let field in obj) {
      html = this.fencedReplace(html, field, obj[field]);
    }
    for (let key in this.custom) {
      let thunk = this.custom[key];
      html = this.fencedReplace(html, key, thunk(obj));
    }
    return this.node.clone().html(html);
  }

  fencedReplace(html, key, value) {
    return html.replace(new RegExp("\{" + key + "\}", 'g'), value);
  }
}
