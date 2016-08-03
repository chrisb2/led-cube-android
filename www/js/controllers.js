angular.module('app.controllers', []).controller('ledCubeCtrl', function($scope, $location, $ionicScrollDelegate, cubeStateFactory) {

  $scope.networkOk = true;
  $scope.apiInProgress = false;
  $scope.settings = undefined;

  initializeState();

  $scope.effects = [
    { name: 'Introduction', value: 0 },
    { name: 'Fireworks', value: 1 },
    { name: 'Rain', value: 2 },
    { name: 'Random Sparkle', value: 3 },
    { name: 'Random Fill', value: 4 },
    { name: 'Worm Squeeze', value: 5 },
    { name: 'Sine Lines', value: 6 },
    { name: 'Line Spin', value: 7 },
    { name: 'Plane Boing', value: 8 },
    { name: 'Box Side', value: 9 },
    { name: 'Axis Up Down', value: 10 },
    { name: 'Ripples', value: 11 },
    { name: 'Side Ripples', value: 12 },
    { name: 'Mirror Ripples', value: 13 },
    { name: 'Quad Ripples', value: 14 },
    { name: 'Random Path', value: 15 },
    { name: 'Pyramid', value: 16 }
  ]

  $scope.$on('$ionicView.loaded', function() {
    ionic.Platform.ready( function() {
      if(navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
    });
  });

  window.onresize = function() {
    if ($scope.settings.sequence === 2) {
      scrollItemIntoView($scope.settings.effect);
    }
  };

  $scope.onOff = function() {
    var argValue = $scope.settings.powerOn ? '1' : '0';
    particleFunctionCall('power', argValue);
  };

  $scope.brightnessChange = function() {
    var argValue = $scope.settings.brightness;
    particleFunctionCall('brightness', argValue);
  };

  $scope.effectChange = function(effectValue) {
    $scope.settings.effect = effectValue;
    var argValue = effectValue.toString();
    particleFunctionCall('effect', argValue);
  };

  $scope.sequenceChange = function(sequenceValue) {
    $scope.settings.sequence = sequenceValue;
    var argValue = sequenceValue.toString();
    particleFunctionCall('sequence', argValue);
  };

  $scope.refresh = function() {
    initializeState();
  };

  function scrollItemIntoView(itemId) {
    $location.hash('ledCube-list-ind-item'+itemId);
    $ionicScrollDelegate.anchorScroll();
  }

  function initializeState() {
    $scope.apiInProgress = true;
    cubeStateFactory.getState().then(
      function(data) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.settings = JSON.parse(data.body.result);
          $scope.networkOk = true;

          if ($scope.settings.sequence === 2) {
            scrollItemIntoView($scope.settings.effect);
          }
        });
        console.log('Variable called successfully:', $scope.settings);
      },
      function(err) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.networkOk = false;
        });
        console.log('An error occurred:', err);
      });
  };

  function particleFunctionCall(functionName, argValue) {
    $scope.apiInProgress = true;
    cubeStateFactory.setState(functionName, argValue).then(
      function(data) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.networkOk = true;
        });
        console.log('Function ' + functionName + '(' + argValue + ') called successfully:', data.body.return_value);
      },
      function(err) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.networkOk = false;
        });
        console.log('An error occurred on function ' + functionName + ':', err);
      });
  }
})
