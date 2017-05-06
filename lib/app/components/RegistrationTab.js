'use strict';

class RegistrationTab extends UIComponent {
  constructor(registration, api, events) {
    super(registration.id);
    let chips = this.node.find('.chips');
    this.registration = registration;
    this.preloader = this.node.find('.sweeper-loader');

    this.node.find('.add-schedule').on('click', () => {
      events.emit('roboto:sweeper-select', {
        registration: registration
      });
      return false;
    });

    events.on('roboto:schedule-saved-' + registration.id, schedule => {
      let chippers = chips.material_chip('data');
      chippers.push(this.toChip(schedule));
      chips.material_chip({ data: chippers });
    });

    events.on('roboto:schedule-deleted-' + registration.clientId + '-' + registration.id, schedule => {
      let chippers = chips.material_chip('data');
      let newChips = [];
      chippers.forEach(chip => {
        if (chip.id != schedule.id) {
          newChips.push(chip);
        }
      });
      chips.material_chip({ data: newChips });
    });

    events.on('roboto:schedules-' + registration.id, schedules => {
      this.preloader.hide();
      events.on('roboto:schedule-modal-submitted', data => {
        this.preloader.show();
        if (this.isRegistration(data)) {
          let parts = data.sweepstake.split('-');
          api.sweepstakes().then(sweepstakes => {
            let schedule = sweepstakes
              .filter(sweeper => parts[0] == sweeper.id
                && parts[1] == sweeper.type)
              .map(sweeper => {
                return {
                  unit: data.interval,
                  amount: 0,
                  sweepstakeData: sweeper,
                };
              })
              .pop();
            if (data.scheduleId) {
              return api.schedules(registration.clientId, registration.id, data.scheduleId, schedule);
            } else {
              return api.schedules(registration.clientId, registration.id, schedule);
            }
          }).then(schedule => {
            if (!data.scheduleId) {
              events.emit('roboto:schedule-saved-' + registration.id, schedule);
            }
            events.emit('roboto:sweepstake-' + data.sweepstake);
            this.preloader.hide();
          });
        }
      });

      // TODO: consider adding autocomplete and add events
      chips.material_chip({
        data: schedules.map(this.toChip)
      });
      chips.on('chip.select', (e, chip) => {
        this.preloader.show();
        api.schedules(registration.clientId, registration.id, chip.id).then(schedule => {
          this.preloader.hide();
          events.emit('roboto:sweeper-select', {
            registration: registration,
            schedule: schedule
          });
        });
      });
      chips.on('chip.delete', (e, chip) => {
        this.preloader.show();
        api.schedules(registration.clientId, registration.id, schedule.id, 'DELETE').then(data => {
          this.preloader.hide();
        });
      });
    });
  }

  isRegistration(data) {
    return data.clientId == this.registration.clientId
      && data.registrationId == this.registration.id;
  }

  toChip(schedule) {
    return {
      tag: schedule.sweepstakeData.type,
      image: schedule.sweepstakeData.image,
      id: schedule.id
    };
  }
}
