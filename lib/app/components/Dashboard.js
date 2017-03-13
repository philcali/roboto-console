'use strict';

class Dashboard extends TransitionComponent {
  constructor(id, events) {
    super(id, events);
    this.node.find('.card-action a').on('click', e => {
      let id = e.target.getAttribute('href').replace('#', 'roboto-');
      events.emit('roboto:transition', id);
      return false;
    });
    events.on('roboto:authorized', user => {
      user.attributes.filter(attr => attr.name == 'image').forEach(attr => {
        this.node.find('.profile-image').attr('src', attr.value);
      });
    });
  }
}
