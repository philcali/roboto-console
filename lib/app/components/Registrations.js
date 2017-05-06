'use strict';

class Registrations extends UIComponent {
  constructor(id, api, events) {
    super(id);
    this.api = api;
    this.events = events;
    this.loader = new UIComponent('roboto-registrations-loader');
    this.container = new UIComponent('roboto-registrations-container');
    this.container.getNode().collapsible({
      accordion: true,
      onOpen: item => {
        item.find('ul.tabs').tabs();
      }
    });
    this.scheduleForm = new Form('schedule-modal', events);
    this.scheduleModal = new UIComponent('schedule-modal');
    this.scheduleModal.getNode().modal();
    this.credentialsForm = new Form('form-credentials', events);
    this.credentialsTemplate = new Template('credentials-item')
      .transform('label', credentials => {
        switch (credentials.type) {
        case 'DEFAULT':
          return 'Managed';
        default:
          return 'Developer';
        }
      })
      .transform('color', credentials => {
        switch (credentials.type) {
        case 'DEFAULT':
          return 'blue';
        default:
          return 'green';
        }
      });

    this.node.find('.add-credentials').on('click', () => {
      this.credentialsForm.show();
      return false;
    });

    events.on('roboto:sweeper-select', data => {
      let formData = {
        clientId: data.registration.clientId,
        registrationId: data.registration.id
      };
      if (data.schedule) {
        formData.sweepstake = [
          data.schedule.sweepstakeData.id,
          data.schedule.sweepstakeData.type
        ].join('-');
        formData.interval = data.schedule.unit;
        formData.scheduleId = data.schedule.id;
      }
      this.scheduleForm.data(formData);
      this.scheduleModal.getNode().modal('open');
    });

    events.on('roboto:form-credentials-canceled', () => {
      this.credentialsForm.hide();
    });

    events.on('roboto:form-credentials-submitted', data => {
      this.credentialsForm.disable();
      this.loader.show();
      api.credentials(data).then(credentials => {
        this.credentialsForm.enable();
        this.credentialsForm.hide();
        events.emit('roboto:credentials-add', credentials);
        if (credentials.type === 'DEFAULT') {
          let body = { name: 'Sweepstake Ninja' };
          api.registrations(credentials.clientId, body).then(
            registration => {
              events.emit('roboto:registration-add-' + credentials.clientId, registration);
              events.emit('roboto:schedules-' + registration.id, []);
              this.loader.hide();
            });
        } else {
          this.loader.hide();
        }
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

    events.on('roboto:sweepstakes', sweepstakes => {
      let dropdown = this.scheduleModal.getNode().find('.sweepstake-select');
      dropdown.material_select('destroy');
      sweepstakes.forEach(sweepstake => {
        dropdown.append($('<option>', {
          value: [sweepstake.id, sweepstake.type].join('-'),
          text: sweepstake.type
        }));
      });
      dropdown.material_select();
    });

    events.on('roboto:credentials', credentials => {
      this.loader.hide();
      credentials.forEach(creds => {
        events.emit('roboto:credentials-add', creds);
        api.registrations(creds.clientId).then(registrations => {
          registrations.forEach(registration => {
            events.emit('roboto:registration-add-' + registration.clientId, registration);
            api.schedules(creds.clientId, registration.id).then(schedules => {
              events.emit('roboto:schedules-' + registration.id, schedules);
            });
          });
        });
      });
    });
  }

  addCredentials(credentials) {
    this.container.append(this.credentialsTemplate
        .replace(credentials)
        .attr('id', credentials.clientId));
    this.container.show();
    let item = new CredentialsItem(credentials, this.api, this.events);
    item.show();
  }
}
