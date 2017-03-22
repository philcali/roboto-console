'use strict';

const SESSION_NAME="roboto";

class RobotoApp {
  constructor(api) {
    this.api = api;
    this.events = new EventManager();
    this.login = new LoginScreen('roboto-login', api, this.events);
    this.settings = new Settings('roboto-settings', api, this.events);
    this.loading = new LoadingScreen('roboto-loading', this.events);
    this.nav = new SweepstakeNav('roboto-nav', this.events);
    this.dashboard = new Dashboard('roboto-dashboard', this.events);
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
          let expiresIn = new Date(session.expiresIn * 1000);
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
      this.events.emit('roboto:transition', 'roboto-login');
    }, 250);
  }

  loadInterface() {
    this.api.me().then(user => {
      this.events.emit('roboto:authorized', user);
      this.events.emit('roboto:transition', 'roboto-dashboard');
      return this.api.sweepstakes();
    })
    .then(sweepstakes => {
      this.events.emit('roboto:sweepstakes', sweepstakes);
      return this.api.credentials();
    })
    .then(credentials => {
      this.events.emit('roboto:credentials', credentials);
    })
    .catch(error => {
      this.loading.hide();
      this.loadError(error);
    });
  }

  loadError(error) {
  }
}
