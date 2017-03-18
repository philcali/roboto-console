'use strict';

class Settings extends TransitionComponent {
  constructor(id, api, events) {
    super(id, events);
    this.api = api;
    this.node.find('ul.tabs').tabs();
    this.profileForm = new Form('form-profile', events);

    events.on('roboto:authorized', user => {
      this.profileForm.data(user.address)
      if (user.address.attributes.length > 0) {
        let attributes = {};
        let birthdate = {};
        user.address.attributes.forEach(attr => {
          if (attr.name.match(/^birth/)) {
            birthdate[attr.name.replace('birth', '')] = attr.value;
          } else {
            attributes[attr.name] = attr.value;
          }
        });
        if (birthdate) {
          attributes['birthdate'] = [birthdate.day, MONTHS[birthdate.month - 1] + ',', birthdate.year].join(' ');
        }
        this.profileForm.data(attributes);
      }
      events.on('roboto:form-profile-submitted', data => {
        let address = { attributes: [] };
        for (let field in data) {
          if (field === 'birthdate') {
            let birthdate = new Date(data[field]);
            address.attributes.push({
              name: 'birthday',
              value: birthdate.getDate()
            });
            address.attributes.push({
              name: 'birthmonth',
              value: birthdate.getMonth() + 1
            });
            address.attributes.push({
              name: 'birthyear',
              value: birthdate.getFullYear()
            });
          } else if (field === 'gender') {
            address.attributes.push({
              name: field,
              value: data[field]
            });
          } else {
            address[field] = data[field];
          }
          this.profileForm.disable();
        }
        api.me({
          address: address,
          attributes: user.attributes
        })
        .then(resp => this.profileForm.enable());
      });
    });
  }

  setUp() {
    this.node.find('ul.tabs').tabs('select_tab', 'profile');
  }

}
