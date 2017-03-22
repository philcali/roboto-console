'use strict';

class Template {
  constructor(id) {
    this.node = $('#' + id).clone().removeClass('template');
  }

  replace(obj) {
    let html = this.node.html();
    for (let field in obj) {
      html = html.replace(new RegExp("\{" + field + "\}"), obj[field]);
    }
    return this.node.clone().html(html);
  }
}
