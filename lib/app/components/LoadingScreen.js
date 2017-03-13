'use strict';

class LoadingScreen extends TransitionComponent {
  isLoading() {
    return this.node.hasClass('roboto-hidden');
  }
}
