# WebUSB NeoPixel Controller

[![1.0.0](https://img.shields.io/badge/Stable-1.0.0-00f557.svg?style=flat)](https://github.com/NERDDISCO/webusb-neopixel-controller/releases/tag/1.0.0)

Manage a NeoPixels with an Arduino-based controller directly from the browser by leveraging WebUSB.

👉 To fully understand the background of this module you should read the article [How to build a WebUSB DMX512 Controller by using an Arduino](https://medium.com/@timpietrusky/how-to-build-a-webusb-dmx512-controller-by-using-an-arduino-e0dd8efb7bf0). 👈

## Table of Contents

<!-- toc -->

- [WebUSB NeoPixel Controller](#webusb-neopixel-controller)
  - [Table of Contents](#table-of-contents)
  - [ES6 module](#es6-module)
    - [Install](#install)
    - [API Documentation](#api-documentation)
    - [Usage](#usage)
    - [Browser Support](#browser-support)
  - [Demo](#demo)
    - [Run locally](#run-locally)
  - [Build your own controller](#build-your-own-controller)
    - [Hardware](#hardware)

<!-- tocstop -->

---

## ES6 module

The module can be used in projects where you want to control a NeoPixel controller over WebUSB. It's written in JavaScript and contains only one Class called `Controller`.

### Install

Install the `webusb-neopixel-controller` module into your project:

```
npm install webusb-neopixel-controller
```


### API Documentation

Can be found on [API documentation](docs/API.md).


### Usage

```javascript
import Controller from 'webusb-neopixel-controller/controller.js'

const controller = new Controller()
const activateButton = document.getElementById('activateWebUsb')

// Listen for click events on the activate button, because
// `controller.enable` must be triggered by a user gesture
activateButton.addEventListener('click', e => {

  // Enable WebUSB and select the Arduino
  controller.enable().then(() => {

    // Create a connection to the selected Arduino
    controller.connect().then(() => {

      // Update the 1 channel of the NeoPixel universe with value 255
      controller.updateUniverse(1, 255)
    })
  })
})
```

Also make sure to take a look the [code behind the demo](#demo) to get more usage examples.

The module is also used in [luminave](https://github.com/NERDDISCO/luminave).


### Browser Support

In order to use the module you have to use a browser that supports WebUSB:

* Chrome 61 + 62: Behind flags
  * `chrome://flags/#enable-experimental-web-platform-features`
* Chrome 63+: Native support

---

## Demo

In order to test the WebUSB NeoPixel Controller directly in the browser you can use the [demo on GitHub](https://nerddisco.github.io/webusb-neopixel-controller). The [code behind the demo](https://github.com/NERDDISCO/webusb-neopixel-controller/tree/master/demo) can be found in the repository.

### Run locally

* Clone [this repository](https://github.com/NERDDISCO/webusb-neopixel-controller)
* Install the dev dependencies by executing `npm install` inside the repository
* Execute `npm start` to start the local web server
* Open the demo on [localhost:8080](http://localhost:8080)

---

## Build your own controller

Check out the article "[How to build a WebUSB DMX512 Controller by using an Arduino](https://medium.com/@timpietrusky/how-to-build-a-webusb-dmx512-controller-by-using-an-arduino-e0dd8efb7bf0)" as it provides a detailed explanation on how to use the content of [this repository](https://github.com/NERDDISCO/webusb-neopixel-controller) to build your own WebUSB NeoPixel or DMX512 Controller:

![Arduino Leonardo with NeoPixel shield attached](https://github.com/NERDDISCO/webusb-neopixel-controller/raw/master/docs/images/webusb_neopixel_controller.jpg)

### Hardware

* 1 x Arduino, tested with:
  * [Arduino Leonardo](https://store.arduino.cc/arduino-leonardo-with-headers)
  * Arduino Leonardo ETH
  * Seeeduino Lite
* 1 x [NeoPixels](https://www.adafruit.com/category/168)
