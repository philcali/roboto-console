'use strict';

class CredentialsItem extends UIComponent {
  constructor(credentials, api, events) {
    super(credentials.clientId);
    this.api = api;
    this.events = events;
    this.preloader = this.node.find('.registration-loader');
    this.tabHeader = this.node.find('ul.tabs');
    this.tabHeaderTemplate = new Template('tab-header');
    this.tabContainer = this.node.find('.tab-contents');
    this.tabContentTemplate = new Template('registration-tab');
    this.node.find('.delete').on('click', () => {
      events.emit('roboto:credentials-remove', this.node);
      return false;
    });

    events.on('roboto:registration-add-' + credentials.clientId, registration => {
      this.preloader.hide();
      this.addRegistration(registration);
    });
  }

  addRegistration(registration) {
    this.tabHeader.append(this.tabHeaderTemplate.replace(registration));
    this.tabContainer.append(this.tabContentTemplate
        .replace(registration)
        .attr('id', registration.id));
    let tab = new RegistrationTab(registration, this.api, this.events);
    return tab;
  }
}
