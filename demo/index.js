import Controller from '../controller.js'
import DevConsole from './dev-console.js'

import { HLSToRGB } from 'hsl-to-rgb-lightweight'

const leds = 60
const ledBytes = leds * 3
const delay = 1

const controller = window.controller = new Controller({ leds: new Array(ledBytes).fill(0) })
const devConsole = new DevConsole({
  output : document.getElementById('console'),
  logLedsElement : document.getElementById('logLeds')
})

const activateButton = document.getElementById('activateWebUsb')
const disconnectButton = document.getElementById('disconnectWebUsb')

const setChannelForm = document.getElementById('updateAnyChannel')

const playBlack = document.getElementById('animationBlack')
const playRainbow = document.getElementById('animationRainbow')
let isAnimationPlaying = false


// Listen for click events on the activate button
activateButton.addEventListener('click', e => {

  // Enable WebUSB and select the Arduino
  controller.enable().then(() => {

    // Create a connection to the selected Arduino
    controller.connect().then(() => {

      // Successfully created a connection to the device
      devConsole.logUsbDevice(controller.device)
    })
  })
  .catch(() => {
    devConsole.log('No USB device was selected', '', 'string')
  })

})



// Disconnect from USB device
disconnectButton.addEventListener('click', e => {
  controller.disconnect().then(() => {
    devConsole.log('Destroyed connection to USB device, but USB device is still paired with the browser', '', 'string')
  })
})



// Automatically connect to paired USB device
controller.autoConnect()
  .then(() => {
    devConsole.log('Found an already paired USB device', '', 'string')
    devConsole.logUsbDevice(controller.device)
  })
  .catch((error) => {
    devConsole.log('autoConnect:', error, 'string')
  })



// Listen for submit events to change the value of a channel
setChannelForm.addEventListener('submit', e => {
  e.preventDefault()

  // Get data out of form
  const data = new FormData(setChannelForm)

  // Parse the data into an Integer
  const channel = parseInt(data.get('channel'), 10)
  const color = data.get('color').match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16))

  devConsole.log('---', '', 'string')
  devConsole.log(`Set LED ${channel} to ${color}`, '', 'string')

  // Update the leds
  controller.update(channel, color)
  .then(() => {
    devConsole.logLeds(controller.leds)
  })
  .catch((error) => {
    devConsole.logLeds(controller.leds)
    devConsole.log(error, '', 'string')
  })
})

// Listen for click events on the black animation button
playBlack.addEventListener('click', e => {
  controller.leds.splice(0, controller.leds.length, ...new Array(ledBytes).fill(0))

  devConsole.log('Set all NeoPixel to black', '', 'string')

  controller.send(controller.leds)
  .then(() => {
    devConsole.logLeds(controller.leds)
  })
  .catch(error => {
    devConsole.logLeds(controller.leds)
    devConsole.log(error, '', 'string')
  })
})

// Listen for click events on the rainbow animation button
playRainbow.addEventListener('click', e => {
  isAnimationPlaying = !isAnimationPlaying
  playRainbow.innerHTML = playRainbow.innerHTML === 'Play' ? 'Pause' : 'Play'

  if (isAnimationPlaying) {
    devConsole.log('Started Rainbow animation', '', 'string')

    loop()
  } else {
    devConsole.log('Stopped Rainbow animation', '', 'string')
  }
})


let colorIndex = 0

const loop = () => {
  if (isAnimationPlaying) {

    for (let i = 0; i < leds; i++) {
      let rgb = HLSToRGB.convert((colorIndex + (i * delay)) % 360, 1, 0.4)
      controller.leds.splice(i * 3, rgb.length, ...rgb)
    }

    colorIndex = ++colorIndex > 360 ? 0 : colorIndex
      
    // Send the updated leds to the controller
    controller.send(controller.leds)
    .then(() => {
    })
    .catch(error => {
      devConsole.logLeds(controller.leds)
      devConsole.log(error, '', 'string')
    })

    window.requestAnimationFrame(loop)
  }
}