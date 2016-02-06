var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    if (event.keyCode == 18) {
      event.preventDefault();
    }
    else {
      this._pressed[event.keyCode] = true;
    }
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};