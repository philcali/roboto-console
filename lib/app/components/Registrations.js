'use strict';

class Registrations extends UIComponent {
  constructor(id, api, events) {
    super(id);
    this.events = events;
    this.loader = new UIComponent('roboto-registrations-loader');
    this.container = new UIComponent('roboto-registrations-container');
    this.credentialsForm = new Form('form-credentials', events);
    this.credentialsTemplate = new Template('credentials-item');

    this.node.find('.add-credentials').on('click', () => {
      this.credentialsForm.show();
      return false;
    });

    events.on('roboto:form-credentials-canceled', () => {
      this.credentialsForm.hide();
    });

    events.on('roboto:form-credentials-submitted', data => {
      this.credentialsForm.disable();
      this.loader.show();
      api.credentials(data).then(credentials => {
        this.loader.hide();
        this.credentialsForm.enable();
        this.credentialsForm.hide();
        events.emit('roboto:credentials-add', credentials);
      });
    });

    events.on('roboto:credentials-add', credentials => {
      this.addCredentials(credentials);
    });

    events.on('roboto:credentials-remove', node => {
      this.loader.show();
      api.credentials(node.attr('id'), 'DELETE').then(resp => {
        this.loader.hide();
        node.remove();
      });
    });

    events.on('roboto:credentials', credentials => {
      this.loader.hide();
      credentials.forEach(creds => {
        events.emit('roboto:credentials-add', creds);
      });
    });
  }

  addCredentials(credentials) {
    this.container.append(this.credentialsTemplate
        .replace(credentials)
        .attr('id', credentials.clientId));
    this.container.show();
    let item = new CredentialsItem(credentials, this.events);
    item.show();
  }
}
