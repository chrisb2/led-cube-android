angular.module('app.controllers', ['in-viewport']).controller('ledCubeCtrl', function($scope, $location, $ionicScrollDelegate, $ionicPlatform, $log, cubeStateFactory) {

  var stateKey = 'state';

  $scope.networkOk = true;
  $scope.apiInProgress = false;
  $scope.settings = { "brightness": "0" }; // default value

  initializeState();

  $scope.programs = [
    { name: 'Sequence', value: 0 },
    { name: 'Random', value: 1 }
  ]

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

  $ionicPlatform.on('resume', function(event) {
    retrieveState();
  });

  $scope.$on('$ionicView.loaded', function() {
    ionic.Platform.ready( function() {
      if(navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
    });
  });

  window.onresize = function() {
    scrollItemIntoView();
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

  function persistState() {
    window.localStorage.setItem(stateKey, JSON.stringify($scope.settings));
  };

  function retrieveState() {
    $scope.settings = JSON.parse(window.localStorage.getItem(stateKey));
  };

  function scrollItemIntoView() {
    if ($scope.settings.sequence === 2) {
      if (!$scope.effects[$scope.settings.effect].visible) {
        $location.hash('ledCube-list-ind-item'+$scope.settings.effect);
        $ionicScrollDelegate.anchorScroll();
      }
    } else {
      if (!$scope.programs[$scope.settings.sequence].visible) {
        $location.hash('ledCube-list-prg-item'+$scope.settings.sequence);
        $ionicScrollDelegate.anchorScroll();
      }
    }
  };

  function initializeState() {
    $scope.apiInProgress = true;
    cubeStateFactory.onStateEvent().then(function(stream) {
      stream.on('event',function(event) {
        updateSettings(event.data);
      })
    });
    cubeStateFactory.getState().then(
      function(data) {
        updateSettings(data.body.result);
      },
      function(err) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.networkOk = false;
        });
        $log.debug('An error occurred:', err);
      });
  };

  function updateSettings(settingsString) {
    $scope.$apply(function(){
      $scope.apiInProgress = false;
      $scope.settings = JSON.parse(settingsString);
      $scope.networkOk = true;
      persistState();
      scrollItemIntoView();
      $log.debug('Settings updated:', $scope.settings);
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
        $log.debug('Function ' + functionName + '(' + argValue + ') called successfully:', data.body.return_value);
      },
      function(err) {
        $scope.$apply(function(){
          $scope.apiInProgress = false;
          $scope.networkOk = false;
        });
        $log.debug('An error occurred on function ' + functionName + ':', err);
      });
  }
})

angular.module('app.controllers').config(function($logProvider) {
  $logProvider.debugEnabled(false);
});

angular.module('app.controllers').config(function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});
