'use strict';

class LoadingScreen extends UIComponent {
  isLoading() {
    return this.node.hasClass('roboto-hidden');
  }
}
