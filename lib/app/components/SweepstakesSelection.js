'use strict';

class SweepstakesSelection extends UIComponent {
  constructor(id, api, events) {
    super(id);
    let masterSchedules = [];
    let sweepers = {};
    this.api = api;
    this.loader = new UIComponent('roboto-sweepstake-loader');
    this.container = new UIComponent('roboto-sweepstake-container');
    this.sweepstakeModal = new UIComponent('sweepstake-modal');
    this.sweepstakeModal.getNode().modal();
    this.sweepstakeForm = new SweepstakeForm('sweepstake-modal', events);
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
      let selectedId = null;
      let selectedInterval = 'DAILY';
      let selectedAmount = 0;
      masterSchedules.forEach(schedule => {
        if (sweepstake.id == schedule.sweepstakeData.id && sweepstake.type == schedule.sweepstakeData.type) {
          selectedId = schedule.id;
          selectedInterval = schedule.unit;
          selectedAmount = schedule.amount;
        }
      });
      this.sweepstakeForm.data({
        interval: selectedInterval,
        amount: selectedAmount,
        scheduleId: selectedId,
        sweeperId: [sweepstake.id, sweepstake.type].join('-')
      });
      this.sweepstakeModal.getNode().find('h5 > span').text(sweepstake.type);
      this.sweepstakeModal.getNode().modal('open');
    });

    events.on('roboto:sweepstake-deleted', sweepstake => {
      for (let index = 0; index < masterSchedules.length; index++) {
        let data = masterSchedules[index].sweepstakeData;
        if (data.type == sweepstake.type && data.id == sweepstake.id) {
          this.loader.show();
          api.schedules(masterSchedules[index].id, 'DELETE').then(() => {
            this.loader.hide();
            masterSchedules.splice(index, 1);
            events.emit('roboto:sweepstake-removed-' + [
              sweepstake.id,
              sweepstake.type
            ].join('-'));
          });
          break;
        }
      }
    });

    events.on('roboto:schedules', schedules => {
      masterSchedules = schedules;
      schedules.forEach(schedule => {
        events.emit('roboto:sweepstake-' + [
          schedule.sweepstakeData.id,
          schedule.sweepstakeData.type
        ].join('-'));
      });
    });
    events.on('roboto:sweepstake-modal-submitted', data => {
      this.loader.show();
      let result = schedule => {
        this.loader.hide();
        masterSchedules.push(schedule);
        events.emit('roboto:sweepstake-' + data.sweeperId);
      };
      let schedule = {
        unit: data.interval,
        amount: parseInt(data.amount),
        sweepstakeData: sweepers[data.sweeperId]
      };
      if (data.scheduleId) {
        api.schedules(data.scheduleId, schedule).then(result);
      } else {
        api.schedules(schedule).then(result);
      }
    });

  }
}
