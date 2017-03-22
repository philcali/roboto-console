'use strict';

class UIComponent {
  constructor(id) {
    this.node = $('#' + id);
  }

  getNode() {
    return this.node;
  }

  show() {
    this.node.removeClass('roboto-hidden').fadeIn('fast');
  }

  hide() {
    this.node.fadeOut('fast', () => this.node.addClass('roboto-hidden'));
  }

  append(node) {
    this.node.append(node);
    return this;
  }
}
