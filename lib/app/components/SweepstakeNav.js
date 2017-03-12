'use scrict';

class SweepstakeNav extends UIComponent {
  constructor(id, events) {
    super(id);
    this.dropdown = this.node.find('#roboto-nav-links');
    events.on('roboto:authorized', user => {
      let link = this.dropdown.find('a > span');
      link.text(user.email);
      this.dropdown.removeClass('roboto-hidden');
    });
  }
}
