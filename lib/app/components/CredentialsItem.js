'use strict';

class CredentialsItem extends UIComponent {
  constructor(credentials, events) {
    super(credentials.clientId);
    this.node.find('.delete').on('click', () => {
      events.emit('roboto:credentials-remove', this.node);
      return false;
    });
  }
}
