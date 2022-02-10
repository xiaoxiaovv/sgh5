/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */
AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    src: {type: 'string'},
    dur: {type: 'number', default: 300},
    room_name: {type: 'string'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    
    this.setupFadeAnimation();
    
    el.addEventListener(data.on, function () {
      // turn on/off buttons for different rooms
      var livingroom_to_bedroom_button = document.querySelector('#livingroom_to_bedroom_button');
      var livingroom_to_bathroom_button = document.querySelector('#livingroom_to_bathroom_button');
      var livingroom_to_kitchen_button = document.querySelector('#livingroom_to_kitchen_button');
      
      var bedroom_to_bathroom_button = document.querySelector('#bedroom_to_bathroom_button');
      var bedroom_to_kitchen_button = document.querySelector('#bedroom_to_kitchen_button');
      var bedroom_to_livingroom_button = document.querySelector('#bedroom_to_livingroom_button');
      
      var bathroom_to_bedroom_button = document.querySelector('#bathroom_to_bedroom_button');
      var bathroom_to_kitchen_button = document.querySelector('#bathroom_to_kitchen_button');
      var bathroom_to_livingroom_button = document.querySelector('#bathroom_to_livingroom_button');
      
      var kitchen_to_bedroom_button = document.querySelector('#kitchen_to_bedroom_button');
      var kitchen_to_bathroom_button = document.querySelector('#kitchen_to_bathroom_button');
      var kitchen_to_livingroom_button = document.querySelector('#kitchen_to_livingroom_button');
      
      // items
      var tv_button = document.querySelector('#tv_button');
      var ac_button = document.querySelector('#ac_button');
      
      var vent_button = document.querySelector('#vent_button');
      var stove_button = document.querySelector('#stove_button');
      var fridge_button = document.querySelector('#fridge_button');
      var wash_button = document.querySelector('#washing_button');
      
      var waterheater_button = document.querySelector('#waterheater_button');
      
      var bedroom_ac_button = document.querySelector('#bedroom_ac_button');
      
      if(data.room_name == "livingroom"){
        //console.log("livingroom clicked");
        setVisible(livingroom_to_bedroom_button, true);
        setVisible(livingroom_to_bathroom_button, true);
        setVisible(livingroom_to_kitchen_button, true);
        
        setVisible(bedroom_to_bathroom_button, false);
        setVisible(bedroom_to_kitchen_button, false);
        setVisible(bedroom_to_livingroom_button, false);
        
        setVisible(bathroom_to_bedroom_button, false);
        setVisible(bathroom_to_kitchen_button, false);
        setVisible(bathroom_to_livingroom_button, false);
        
        setVisible(kitchen_to_bedroom_button, false);
        setVisible(kitchen_to_bathroom_button, false);
        setVisible(kitchen_to_livingroom_button, false);
        
        // items
        setVisible(tv_button, true);
        setVisible(ac_button, true);
        
        setVisible(vent_button, false);
        setVisible(stove_button, false);
        setVisible(fridge_button, false);
        setVisible(wash_button, false);
        
        setVisible(waterheater_button, false);
        
        setVisible(bedroom_ac_button, false);
      }
      else if(data.room_name == "kitchen"){
        //console.log("kitchen clicked");
        setVisible(livingroom_to_bedroom_button, false);
        setVisible(livingroom_to_bathroom_button, false);
        setVisible(livingroom_to_kitchen_button, false);
        
        setVisible(bedroom_to_bathroom_button, false);
        setVisible(bedroom_to_kitchen_button, false);
        setVisible(bedroom_to_livingroom_button, false);
        
        setVisible(bathroom_to_bedroom_button, false);
        setVisible(bathroom_to_kitchen_button, false);
        setVisible(bathroom_to_livingroom_button, false);
        
        setVisible(kitchen_to_bedroom_button, true);
        setVisible(kitchen_to_bathroom_button, true);
        setVisible(kitchen_to_livingroom_button, true);
       
        setVisible(tv_button, false);
        setVisible(ac_button, false);
        
        setVisible(vent_button, true);
        setVisible(stove_button, true);
        setVisible(fridge_button, true);
        setVisible(wash_button, true);
        
        setVisible(waterheater_button, false);
        
        setVisible(bedroom_ac_button, false);
      }
      else if(data.room_name == "bedroom"){
        //console.log("bedroom clicked");
        setVisible(livingroom_to_bedroom_button, false);
        setVisible(livingroom_to_bathroom_button, false);
        setVisible(livingroom_to_kitchen_button, false);
        
        setVisible(bedroom_to_bathroom_button, true);
        setVisible(bedroom_to_kitchen_button, true);
        setVisible(bedroom_to_livingroom_button, true);
        
        setVisible(bathroom_to_bedroom_button, false);
        setVisible(bathroom_to_kitchen_button, false);
        setVisible(bathroom_to_livingroom_button, false);
        
        setVisible(kitchen_to_bedroom_button, false);
        setVisible(kitchen_to_bathroom_button, false);
        setVisible(kitchen_to_livingroom_button, false);
        
        setVisible(tv_button, false);
        setVisible(ac_button, false);
        
        setVisible(vent_button, false);
        setVisible(stove_button, false);
        setVisible(fridge_button, false);
        setVisible(wash_button, false);
        
        setVisible(waterheater_button, false);
        
        setVisible(bedroom_ac_button, true);
      }
      else if(data.room_name == "bathroom"){
        //console.log("bathroom clicked");
        setVisible(livingroom_to_bedroom_button, false);
        setVisible(livingroom_to_bathroom_button, false);
        setVisible(livingroom_to_kitchen_button, false);
        
        setVisible(bedroom_to_bathroom_button, false);
        setVisible(bedroom_to_kitchen_button, false);
        setVisible(bedroom_to_livingroom_button, false);
        
        setVisible(bathroom_to_bedroom_button, true);
        setVisible(bathroom_to_kitchen_button, true);
        setVisible(bathroom_to_livingroom_button, true);
        
        setVisible(kitchen_to_bedroom_button, false);
        setVisible(kitchen_to_bathroom_button, false);
        setVisible(kitchen_to_livingroom_button, false);
        
        setVisible(tv_button, false);
        setVisible(ac_button, false);
        
        setVisible(vent_button, false);
        setVisible(stove_button, false);
        setVisible(fridge_button, false);
        setVisible(wash_button, false);
        
        setVisible(waterheater_button, true);
        
        setVisible(bedroom_ac_button, false);
      }

      //console.log("set image function");
      // Fade out image.
      data.target.emit('set-image-fade');
      // Wait for fade to complete.
      setTimeout(function () {
        // Set image.
        data.target.setAttribute('material', 'src', data.src);
      }, data.dur);
      
      currentRoomTag = data.src;
      
    });
    
      
    function setVisible(whichButton, isVisible) {
      //console.log("call function");
      whichButton.setAttribute('visible', isVisible);
      if(isVisible){
        whichButton.setAttribute('scale', "1 1 1");
      }
      else{
        whichButton.setAttribute('scale', "0 0 0");
      }
    }
  },

  /**
   * Setup fade-in + fade-out.
   */
  setupFadeAnimation: function () {
    var data = this.data;
    var targetEl = this.data.target;

    // Only set up once.
    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    // Create animation.
    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur,
      from: '#FFF',
      to: '#000'
    });
  }
});