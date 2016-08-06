angular.module('app.services', []).factory('cubeStateFactory', [function(){

  var factory = {};
  var particle = new Particle();

  factory.getState = function() {
    var fnPr = particle.getVariable({
      deviceId: PARTICLE_DEVICE_ID,
      name: 'state',
      auth: PARTICLE_TOKEN
    });
    return fnPr;
  };

  factory.setState = function(attribute, value) {
    var fnPr = particle.callFunction({
      deviceId: PARTICLE_DEVICE_ID,
      name: attribute,
      argument: value,
      auth: PARTICLE_TOKEN
    });
    return fnPr;
  };

  factory.onStateEvent = function() {
    var fnPr = particle.getEventStream({
      deviceId: PARTICLE_DEVICE_ID,
      name: 'stateChange',
      auth: PARTICLE_TOKEN
    });
    return fnPr;
  };

  return factory;
}]);
