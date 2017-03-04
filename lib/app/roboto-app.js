'use strict';

const SESSION_NAME="roboto";

class RobotoApp {
  constructor(api) {
    this.api = api;
    this.loading = new LoadingScreen('roboto-loading');
    this.login = new LoginScreen('roboto-login', api);
    this.hash = new HashParser();
    this.state = new CompositeStateManager([
      new LocalStorageStateManager(),
      new CookieStateManager()
    ]);
    this.api.setAccessToken(this.state.getItem(SESSION_NAME));
  }

  isLoggedIn() {
    return this.api.isAuthenticated();
  }

  attemptLogin(token, callback) {
    let info = this.hash.parse(token);
    if (info.error) {
      callback(info.error);
    } else if (info.code && info.nonce) {
      this.api
        .authenticate(info.type, info.code, info.nonce)
        .then(session => {
          this.state.putItem(SESSION_NAME, session.id, 60 * 60);
          this.api.setAccessToken(session.id);
          location.replace('/');
        })
        .catch(callback);
    } else {
      callback();
    }
  }

  loadSignin() {
    this.loading.hide();
    this.login.show();
  }

  loadInterface() {
  }
}
