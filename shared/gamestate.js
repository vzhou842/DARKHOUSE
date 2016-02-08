function Gamestate(data) {
  var gameID = data.gameID;
  this.ghostHP = 100;

  this.positions = {};
  this.velocities = {};
  this.flashlight = {};
  this.battery = {};
}

