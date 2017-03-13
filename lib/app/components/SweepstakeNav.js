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
    this.node.find('#account-dropdown a').on('click', e => {
      let id = e.target.getAttribute('href').replace('#', '');
      this.dropdown.find('.dropdown-button').dropdown('close');
      events.emit('roboto:transition', 'roboto-' + id);
      return false;
    });
  }
}
