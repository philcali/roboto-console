'use strict';

class TransitionComponent extends UIComponent {
  constructor(id, events) {
    super(id);
    this.events = events;
    this.events.on('roboto:transition', page => {
      if (page === id) {
        this.show();
        this.setUp();
      } else {
        this.hide();
        this.tearDown();
      }
    });
  }

  setUp() {
  }

  tearDown() {
  }
}
