'use strict';

const STATES = [
  { id: 'AL', name: 'Alabama' },
  { id: 'AK', name: 'Alaska' },
  { id: 'AZ', name: 'Arizona' },
  { id: 'AR', name: 'Arkansas' },
  { id: 'CA', name: 'California' },
  { id: 'CO', name: 'Colorado' },
  { id: 'CT', name: 'Connecticut' },
  { id: 'DE', name: 'Delaware' },
  { id: 'FL', name: 'Florida' },
  { id: 'GA', name: 'Georgia' },
  { id: 'HI', name: 'Hawaii' },
  { id: 'ID', name: 'Idaho' },
  { id: 'IL', name: 'Illinois' },
  { id: 'IN', name: 'Indiana' },
  { id: 'IA', name: 'Iowa' },
  { id: 'KS', name: 'Kansas' },
  { id: 'KY', name: 'Kentucky' },
  { id: 'LA', name: 'Louisiana' },
  { id: 'ME', name: 'Maine' },
  { id: 'MD', name: 'Maryland'},
  { id: 'MA', name: 'Massachusetts' },
  { id: 'MI', name: 'Michigan' },
  { id: 'MN', name: 'Minnesota' },
  { id: 'MS', name: 'Mississippi' },
  { id: 'MO', name: 'Missouri' },
  { id: 'MT', name: 'Montana' },
  { id: 'NE', name: 'Nebraska' },
  { id: 'NV', name: 'Nevada' },
  { id: 'NH', name: 'New Hampshire' },
  { id: 'NJ', name: 'New Jersey' },
  { id: 'NM', name: 'New Mexico' },
  { id: 'NY', name: 'New York' },
  { id: 'NC', name: 'North Carolina' },
  { id: 'ND', name: 'North Dakota' },
  { id: 'OH', name: 'Ohio' },
  { id: 'OK', name: 'Oklahoma' },
  { id: 'OR', name: 'Oregon' },
  { id: 'PA', name: 'Pennsylvania' },
  { id: 'RI', name: 'Rhode Island' },
  { id: 'SC', name: 'South Carolina' },
  { id: 'SD', name: 'South Dakota' },
  { id: 'TN', name: 'Tennessee' },
  { id: 'TX', name: 'Texas' },
  { id: 'UT', name: 'Utah' },
  { id: 'VT', name: 'Vermont' },
  { id: 'VA', name: 'Virginia' },
  { id: 'WA', name: 'Washington' },
  { id: 'WV', name: 'West Virginia' },
  { id: 'WI', name: 'Wisconsin' },
  { id: 'WY', name: 'Wyoming' }
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

class Form extends UIComponent {
  constructor(id, events) {
    super(id);
    this.cancel = this.node.find('.cancel');
    this.submit = this.node.find('button[type=submit]');
    this.submit.on('click', e => {
      events.emit('roboto:' + id + '-submitted', this.data());
      return false;
    });
    this.cancel.on('click', e => {
      events.emit('roboto:' + id + '-canceled');
      return false;
    });
    this.node.find('.roboto-state').each((i, node) => {
      let $node = $(node);
      STATES.forEach(state => {
        $node.append($('<option>', {
          value: state.id,
          text: state.name
        }));
      });
      $node.material_select();
    });
    this.node.find('select').material_select();
    this.node.find('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 100
    });
  }

  fields() {
    return this.node.find('[name]');
  }

  disable() {
    this.fields().prop('disabled', true);
    this.submit.prop('disabled', true);
  }

  enable() {
    this.fields().prop('disabled', false);
    this.submit.prop('disabled', false);
  }

  data() {
    let information = arguments[0];
    if (information) {
      for (let key in information) {
        let $node = this.node.find('[name=' + key + ']');
        $node.val(information[key]);
        if ($node.attr('type') == 'radio') {
          this.node
            .find('[name=' + key + '][value=' + information[key] + ']')
            .prop('checked', true);
        } else if ($node.prop('tagName') == 'SELECT') {
          $node.material_select();
        }
      }
      Materialize.updateTextFields();
      return this;
    } else {
      information = {};
      this.fields().each((i, node) => {
        let $node = $(node);
        let value = $node.val();
        if (value !== '') {
          information[$node.attr('name')] = value;
        }
      });
      return information;
    }
  }
}
