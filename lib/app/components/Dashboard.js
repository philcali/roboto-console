'use strict';

class Dashboard extends TransitionComponent {
  constructor(id, events) {
    super(id, events);
    this.loader = new UIComponent('events-loading-bar');
    this.container = new UIComponent('roboto-events-container');
    this.eventTemplate = new Template('event-item')
      .transform('time', event => {
        let time = new Date(event.creationTime);
        return [
          time.toLocaleDateString(),
          time.toLocaleTimeString()
        ].join(' ');
      })
      .transform('shortMessage', event => {
        return event.message.substr(0, 100);
      })
      .transform('color', event => {
        switch (event.type) {
        case 'INFO':
          return 'green';
        case 'ERROR':
          return 'red';
        }
      })
      .transform('icon', event => {
        switch (event.type) {
        case 'INFO':
          return 'done';
        case 'ERROR':
          return 'error';
        }
      });
    this.node.find('.card-action a').on('click', e => {
      let id = e.target.getAttribute('href').replace('#', 'roboto-');
      events.emit('roboto:transition', id);
      return false;
    });

    events.on('roboto:events', events => {
      this.loader.hide();
      events.reverse().slice(0, 10).forEach(event => {
        this.container.append(this.eventTemplate.replace(event));
      });
    });
    events.on('roboto:authorized', user => {
      user.attributes.filter(attr => attr.name == 'image').forEach(attr => {
        this.node.find('.profile-image').attr('src', attr.value);
      });
    });
  }
}
