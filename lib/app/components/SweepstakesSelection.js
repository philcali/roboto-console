'use strict';

class SweepstakesSelection extends UIComponent {
  constructor(id, api, events) {
    super(id);
    this.api = api;
    this.loader = new UIComponent('roboto-sweepstake-loader');
    this.container = new UIComponent('roboto-sweepstake-container');
    let template = new Template('sweepstake-card');
    events.on('roboto:sweepstakes', sweepstakes => {
      this.loader.hide();
      sweepstakes.forEach(sweepstake => {
        let sweeperId = [sweepstake.id, sweepstake.type].join('-');
        this.container.append(template.replace(sweepstake).attr('id', sweeperId));
        let card = new SweepstakeCard(sweeperId, sweepstake, events);
        card.show();
      });
      this.container.show();
    });
  }
}
