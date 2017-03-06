'use strict';

const SESSION_NAME="roboto";

class RobotoApp {
  constructor(api) {
    this.api = api;
    this.loading = new LoadingScreen('roboto-loading');
    this.login = new LoginScreen('roboto-login', api);
    this.nav = new SweepstakeNav('roboto-nav', api);
    this.dashboard = new Dashboard('roboto-dashboard');
    this.urlParser = new URLParser();
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
    let info = this.urlParser.parse(token);
    if (info.error) {
      callback(info.error);
    } else if (info.code && info.state) {
      this.api
        .authenticate(info.type || 'GOOGLE', info.code, info.state)
        .then(session => {
          let expiresIn = new Date(session.expiresIn);
          let seconds = expiresIn.getTime() - Date.now();
          this.state.putItem(SESSION_NAME, session.accessToken, seconds / 1000);
          this.api.setAccessToken(session.accessToken);
          location.replace('/');
        })
        .catch(callback);
    } else {
      callback();
    }
  }

  loadSignin() {
    setTimeout(() => {
      this.loading.hide();
      this.login.show();
    }, 250);
  }

  loadInterface() {
    this.api.me().then(user => {
      this.loading.hide();
      // Load the actual interface (once built)
      this.dashboard.show();
    })
    .catch(error => {
      this.loading.hide();
      this.loadError(error);
    });
  }
}
