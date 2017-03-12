'use strict';

class Dashboard extends UIComponent {
  constructor(id, events) {
    super(id);
    events.on('roboto:authorized', user => {
      this.show();
    });
  }
}
