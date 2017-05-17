'use strict';

class CredentialsItem extends UIComponent {
  constructor(credentials, api, events) {
    super(credentials.clientId);
    this.api = api;
    this.events = events;
    this.node.find('.delete').on('click', () => {
      events.emit('roboto:credentials-remove', this.node);
      return false;
    });
  }
}
