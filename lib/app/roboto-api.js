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

  me() {
    let myUrl = this.builder().addPath("me");
    return fetch(myUrl.build(), { headers: this.authorize() })
      .then(this.handleErrors)
      .then(resp => resp.json())
      .then(getUser => getUser.user)
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

  handleErrors(resp) {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp;
  }
}
