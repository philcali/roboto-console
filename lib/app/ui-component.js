'use strict';

class UIComponent {
  constructor(id) {
    this.node = $('#' + id);
  }

  show() {
    this.node.removeClass('roboto-hidden').fadeIn('fast');
  }

  hide() {
    this.node.fadeOut('fast', () => this.node.addClass('roboto-hidden'));
  }
}
