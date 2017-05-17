'use strict';

class SweepstakeForm extends Form {
  constructor(id, events) {
    let $amount = $('#' + id).find('.roboto-hours');
    let setDaily = () => {
      let formatter = hour => {
        if (hour === 0) {
          return '12:00 AM';
        } else if (hour < 12) {
          return (hour < 10 ? '0' : '') + hour + ':00 AM';
        } else if (hour === 12) {
          return '12:00 PM';
        } else {
          hour = hour - 12;
          return (hour < 10 ? '0' : '') + hour + ':00 PM';
        }
      };
      for (let i = 0; i < 24; i++) {
        $amount.append($('<option>', {
          value: i,
          text: formatter(i)
        }));
      }
      $amount.material_select();
    };

    let setHourly = () => {
      let formatter = hour => {
        if (hour < 10) {
          return '0' + hour;
        } else {
          return hour;
        }
      };
      for (let i = 0; i < 60; i++) {
        $amount.append($('<option>', {
          value: i,
          text: formatter(i)
        }));
      }
      $amount.material_select();
    };
    setDaily();

    super(id, events);

    this.node.find('[name=interval]').on('change', function() {
      $amount.material_select('destroy');
      $amount.children().remove();
      if (this.value == 'DAILY') {
        setDaily();
      } else {
        setHourly();
      }
    });
  }
}
