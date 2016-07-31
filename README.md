# Led Cube Android Application

A [PhoneGap](http://phonegap.com/) and [Ionic](http://ionicframework.com/) based Android application for controlling my [Led Cube](https://github.com/chrisb2/led-cube).

## Building

Add a file _auth.js_ in _www/js_ containing global variables for the Particle API authentication:

```
PARTICLE_DEVICE_ID = '<device id>';
PARTICLE_TOKEN = '<token>';
```

Run the following to generate a QR Code which can be used to install the application:

`npm run apk`
