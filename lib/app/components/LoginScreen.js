'use strict';

class LoginScreen extends TransitionComponent {
  constructor(id, api, events) {
    super(id, events);
    let bar = new UIComponent('roboto-loading-bar');
    this.node.find('a[data-signin]').on('click', function() {
      var $button = $(this).addClass('disabled');
      var type = $button.data('signin');
      bar.show();
      api.authUrl(type)
        .then(function(authUrl) {
          window.location = authUrl;
        })
        .catch(function() {
          bar.hide();
          $button.removeClass('disabled');
        });
      return false;
    });
  }
}
