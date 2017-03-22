'use strict';

class SweepstakeCard extends UIComponent {
  constructor(id, sweepstake, events) {
    super(id);

    events.on('roboto:sweepstake-' + id, () => {
      this.node.find('.material-icons').text('done');
    });

    this.node.find('.btn-floating').on('click', () => {
      events.emit('roboto:sweepstake-selected', sweepstake);
    });
  }
}
