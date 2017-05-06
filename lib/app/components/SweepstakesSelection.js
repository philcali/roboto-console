'use strict';

class SweepstakesSelection extends UIComponent {
  constructor(id, api, events) {
    super(id);
    let registrations = [];
    let sweepers = {};
    this.api = api;
    this.loader = new UIComponent('roboto-sweepstake-loader');
    this.container = new UIComponent('roboto-sweepstake-container');
    this.sweepstakeModal = new UIComponent('sweepstake-modal');
    this.sweepstakeModal.getNode().modal();
    this.sweepstakeForm = new Form('sweepstake-modal', events);
    let template = new Template('sweepstake-card');
    events.on('roboto:sweepstakes', sweepstakes => {
      this.loader.hide();
      sweepstakes.forEach(sweepstake => {
        let sweeperId = [sweepstake.id, sweepstake.type].join('-');
        sweepers[sweeperId] = sweepstake;
        this.container.append(template.replace(sweepstake).attr('id', sweeperId));
        let card = new SweepstakeCard(sweeperId, sweepstake, events);
        card.show();
      });
      this.container.show();
    });

    events.on('roboto:sweepstake-selected', sweepstake => {
      let dropdown = this.sweepstakeModal.getNode().find('.sweepstake-select');
      let selectedId = null;
      let selectedRegistrationId = null;
      let selectedInterval = 'DAILY';
      dropdown.material_select('destroy');
      dropdown.find('option').remove();
      registrations.forEach(registration => {
        let registrationId = [registration.credentials.clientId, registration.registration.id].join(':');
        registration.schedules.forEach(schedule => {
          if (sweepstake.id == schedule.sweepstakeData.id && sweepstake.type == schedule.sweepstakeData.type) {
            selectedRegistrationId = registrationId;
            selectedId = [registrationId, schedule.id].join(':');
            selectedInterval = schedule.unit;
          }
        });
        dropdown.append($('<option>', {
          value: registrationId,
          text: [registration.credentials.name, registration.registration.name].join(' - ')
        }));
      });
      dropdown.material_select();
      this.sweepstakeForm.data({
        interval: selectedInterval,
        registrationId: selectedRegistrationId,
        scheduleId: selectedId,
        sweeperId: [sweepstake.id, sweepstake.type].join('-')
      });
      this.sweepstakeModal.getNode().modal('open');
    });

    events.on('roboto:credentials-remove', node => {
      let clientId = node.attr('id');
      registrations = registrations.filter(registration => {
        return registration.credentials.clientId != clientId;
      });
    });

    events.on('roboto:sweepstake-modal-submitted', data => {
      let parts = data.registration.split(':');
      let clientId = parts[0];
      let registrationId = parts[1];
      let addSchedule = () => {
        this.loader.show();
        api.schedules(clientId, registrationId, {
          unit: data.interval,
          amount: 0,
          sweepstakeData: sweepers[data.sweeperId]
        }).then(schedule => {
          this.loader.hide();
          events.emit('roboto:schedule-saved-' + registrationId, schedule);
          events.emit('roboto:sweepstake-' + data.sweeperId);
        });
      };
      if (data.scheduleId) {
        let scheduleParts = data.scheduleId.split(':');
        api.schedules(scheduleParts[0], scheduleParts[1], scheduleParts[2], 'DELETE').then(() => {
          events.emit('roboto:schedule-deleted-' + scheduleParts[0] + '-' + scheduleParts[1], { id: scheduleParts[2] });
        });
      }
      addSchedule();
    });

    events.on('roboto:credentials', credentials => {
      credentials.forEach(creds => {
        events.on('roboto:registration-add-' + creds.clientId, registration => {
          let reg = {
            credentials: creds,
            registration: registration
          };
          events.on('roboto:schedules-' + registration.id, schedules => {
            reg.schedules = schedules;
            schedules.forEach(schedule => {
              events.emit('roboto:sweepstake-' + [
                schedule.sweepstakeData.id,
                schedule.sweepstakeData.type
              ].join('-'));
            });
          });
          registrations.push(reg);
        });
      });
    });
  }
}
