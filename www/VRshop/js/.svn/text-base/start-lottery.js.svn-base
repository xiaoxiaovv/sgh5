/* global AFRAME */

AFRAME.registerComponent('start-lottery', {
  schema: {
    on: {type: 'string'},
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    el.addEventListener(data.on, function () {
      startLottery();
    });
  },

});