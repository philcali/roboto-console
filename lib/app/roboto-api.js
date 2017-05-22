'use strict';

class RobotoAPI {
  constructor() {
    this.baseUrl = arguments[0] || "https://pa6zqo08w1.execute-api.us-east-1.amazonaws.com/v1";
    this.accessToken = arguments[1] || false;
  }

  builder() {
    return new URLBuilder({ baseUrl: this.baseUrl });
  }

  authUrl(type) {
    let authUrl = this.builder().addPath("auth").addQuery("type", type);
    return fetch(authUrl.build())
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(auth => auth.message);
  }

  authenticate(type, code, nonce) {
    let authUrl = this.builder()
      .addPath("auth").addPath(type)
      .addQuery("code", code)
      .addQuery("nonce", nonce);
    return fetch(authUrl.build())
      .then(this.handleErrors)
      .then(resp => resp.json());
  }

  /**
   * api.me() // gets self
   * api.me({ address: { firstname: 'Philip' } }) // updated
   */
  me() {
    let updatedUser = arguments[0];
    let action = path => {
      if (updatedUser) {
        let body = { user : updatedUser }
        let headers = this.authorize();
        headers.append("Content-Type", "application/json");
        return fetch(path, {
          headers: headers,
          method: "PUT",
          body: JSON.stringify(body)
        });
      } else {
        return fetch(path, { headers: this.authorize() });
      }
    };
    return action(this.builder().addPath("me").build())
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(getUser => getUser.user);
  }

  /**
   * api.credentials() // list them
   * api.credentials(clientId) // get's a single one
   * api.credentials({ name: 'My Own', scopes: [WRITE_ACCOUNT] })
   * api.credentials(clientId, 'DELETE')
   */
  credentials() {
    let generate = arguments[0];
    let method = arguments[1];
    let action = this.curryAction(generate, method, credentials => {
      return { credentials: credentials };
    });
    return action(this.builder().addPath("credentials"))
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(getCreds => getCreds ? getCreds.credentials : true);
  }

  /**
   * api.schedules() // list them
   * api.schedules(scheduleId) // get one
   * api.schedules({ amount: 0, interval: DAILY })
   * api.schedules(scheduleId, 'DELETE') // deletes one
   */
  schedules() {
    let scheduleId = arguments[0];
    let method = arguments[1];
    let action = this.curryAction(scheduleId, method, schedule => {
      return { schedule: schedule };
    });
    return action(this.builder().addPath("schedules"))
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(getSchedules => {
        if (getSchedules) {
          let field = scheduleId ? "schedule" : "schedules";
          return getSchedules[field];
        } else {
          return true;
        }
      });
  }

  /**
   * api.sweepstakes() // list them
   */
  sweepstakes() {
    let url = this.builder().addPath("sweepstakes");
    return fetch(url.build(), { headers: this.authorize() })
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(resp => resp.sweepstakes);
  }

  /**
   * api.sweepstakes() // list them
   */
  events() {
    let url = this.builder().addPath("events");
    return fetch(url.build(), { headers: this.authorize() })
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(resp => resp.events);
  }

  authorize() {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + this.accessToken);
    return headers;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  isAuthenticated() {
    return this.accessToken;
  }

  curryAction(idOrPayload, methodOrPayload, wrapping) {
    return path => {
      let headers = this.authorize();
      headers.append("Content-Type", "application/json");
      if (typeof idOrPayload === 'object') {
        return fetch(path.build(), {
          headers: headers,
          method: "POST",
          body: JSON.stringify(wrapping(idOrPayload))
        });
      } else if (typeof idOrPayload === 'string') {
        let url = path.addPath(idOrPayload).build();
        if (typeof methodOrPayload === 'object') {
          return fetch(url, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify(wrapping(methodOrPayload))
          });
        } else {
          return fetch(url, {
            headers: headers,
            method: typeof methodOrPayload === 'undefined' ? 'GET' : methodOrPayload
          });
        }
      } else {
        return fetch(path.build(), { headers: headers });
      }
    };
  }

  handleErrors(resp) {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp;
  }
}
