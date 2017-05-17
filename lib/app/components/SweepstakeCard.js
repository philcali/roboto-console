'use strict';

class SweepstakeCard extends UIComponent {
  constructor(id, sweepstake, events) {
    super(id);

    events.on('roboto:sweepstake-' + id, () => {
      this.node.find('.material-icons').text('delete');
    });

    events.on('roboto:sweepstake-removed-' + id, () => {
      this.node.find('.material-icons').text('add');
    });

    this.node.find('.btn-floating').on('click', () => {
      if (this.node.find('.material-icons').text() == 'delete') {
        events.emit('roboto:sweepstake-deleted', sweepstake);
      } else {
        events.emit('roboto:sweepstake-selected', sweepstake);
      }
    });
  }
}
