/**
 * The controller is creating a connection to the USB device (Arduino) to send data over WebUSB.
 * By using the default <code>args</code> you will only see the following Arduino in the user prompt:
 * - Arduino Leonardo
 * - Arduino Leonardo ETH
 * - Seeeduino Lite
 * @module Controller
 *
 * @param {Object} args - Arguments to configure the controller
 * @param {Object[]} args.filters - List of devices that are whitelisted when opening the user prompt to select an Arduino
 * @param {Object} args.device - The selected Arduino to use as the controller
 * @param {number[]} args.leds - Holds all the values for each led of the leds
 * @example
 * import Controller from 'webusb-neopixel-controller/controller.js'
 *
 * // Create a new controller using the default properties
 * const controller = new Controller()
 */
export default class Controller {

  constructor(args = {}) {
    // Reference to the selected USB device
    this.device = args.device || undefined

    // Only allow specific USB devices
    this.filters = args.filters || [
      // Arduino Leonardo
      { vendorId: 0x2341, productId: 0x8036 },
      { vendorId: 0x2341, productId: 0x0036 },
      { vendorId: 0x2a03, productId: 0x8036 },
      { vendorId: 0x2a03, productId: 0x0036 },

      // Arduino Leonardo ETH
      { vendorId: 0x2a03, productId: 0x0040 },
      { vendorId: 0x2a03, productId: 0x8040 },

      // Seeeduino Lite
      { vendorId: 0x2886, productId: 0x8002 }
    ]

    // Initialize the array that holds the NeoPixels
    this.leds = new Array(args.leds * 3).fill(0)
  }

  /**
   * Enable WebUSB and save the selected Arduino into <code>controller.device</code>
   *
   * Note: This function has to be triggered by a user gesture
   *
   * @return {Promise}
   *
   * @example
   * controller.enable().then(() => {
   *   // Create a connection to the selected Arduino
   *   controller.connect().then(() => {
   *     // Successfully created a connection
   *   })
   * })
   * .catch(error => {
   *   // No Arduino was selected by the user
   * })
   */
  enable() {
    // Request access to the USB device
    return navigator.usb.requestDevice({ filters: this.filters })

    // selectedDevice = the USB device that was selected by the user in the browser
    .then(selectedDevice => {
      this.device = selectedDevice
    })
  }

  /**
   * Get a USB device that was already paired with the browser.
   *
   * @return {Promise}
   */
  getPairedDevice() {
    return navigator.usb.getDevices()

    .then(devices => {
      return devices[0]
    })
  }

  /**
   * Automatically connect to a USB device that was already paired with the Browser and save it into <code>controller.device</code>
   *
   * @return {Promise}
   * @example
   * controller.autoConnect()
   *   .then(() => {
   *     // Connected to already paired Arduino
   *   })
   *   .catch(error => {
   *     // Nothing found or found paired Arduino, but it's not connected to computer
   *   })
   */
  autoConnect() {
    return this.getPairedDevice().then((device) => {

      this.device = device

      return new Promise((resolve, reject) => {

        // USB Device is not connected to the computer
        if (this.device === undefined) {
          return reject(new Error('Can not find USB device.'))

        // USB device is connected to the computer, so try to create a WebUSB connection
        } else {
          return resolve(this.connect())
        }

      })

    })
  }

  /**
   * Open a connection to the selected USB device and tell the device that
   * we are ready to send data to it.
   *
   * @return {Promise}
   * @example
   * controller.connect().then(() => {
   *   // Successfully created a connection to the selected Arduino
   * })
   */
  connect() {
    // Open connection
    return this.device.open()

    // Select #1 configuration if not automatially set by OS
    .then(() => {
      if (this.device.configuration === null) {
        return this.device.selectConfiguration(1)
      }
    })

    // Get exclusive access to the #2 interface
    .then(() => this.device.claimInterface(2))

    // Tell the USB device that we are ready to send data
    .then(() => this.device.controlTransferOut({
        // It's a USB class request
        'requestType': 'class',
        // The destination of this request is the interface
        'recipient': 'interface',
        // CDC: Communication Device Class
        // 0x22: SET_CONTROL_LINE_STATE
        // RS-232 signal used to tell the USB device that the computer is now present.
        'request': 0x22,
        // Yes
        'value': 0x01,
        // Interface #2
        'index': 0x02
      })
    )

    .then(() => {
      this.readLoop()
    })
  }

  /**
   * Read data from the NeoPixel Controller
   *
   * @return {Promise}
   */
  readLoop() {
    // Get data from the USB device on Endpoint #5
    this.device.transferIn(5, 1).then(result => {
      var amountLeds = new Uint8Array(result.data.buffer)
      console.log(`Connected NeoPixels: ${amountLeds}`)

      this.readLoop()
    }, error => {
      console.log(error)
    })
  }

  /**
   * Send data to the USB device to update the leds
   *
   * @param {Array} data - List containing all leds that should be updated
   *
   * @return {Promise}
   * @example
   * controller.send([255, 0, 0])
   */
  send(data) {
    return new Promise((resolve, reject) => {

      // USB Device is not connected to the computer
      if (this.device === undefined) {
        return reject(new Error('USB device is not connected to the computer'))

      // USB device is connected to the computer, so try to create a WebUSB connection
      } else {
        // Create an ArrayBuffer, because that is needed for WebUSB
        const buffer = Uint8Array.from(data)

        // Send data on Endpoint #4
        return resolve(this.device.transferOut(4, buffer))
      }

    })
  }

  /**
   * Update the <code>led</code>(s) of the leds with the provided <code>value</code>
   *
   * @param {number} led - The led to update
   * @param {(number|number[])} value - The value to update the led, supporting two different modes: single (= <code>number</code>) & multi (= <code>Array</code>)
   * @example <caption>Update a single led</caption>
   * // Update led #1 with color red (rgb(255, 0, 0))
   * controller.update(1, [255, 0, 0])
   * @example <caption>Update multiple leds starting with led</caption>
   * // Update led #5 with red (rgb(255, 0, 0)), #6 with green (rgb(0, 255, 0))
   * controller.update(5, [255, 0, 0, 0, 255, 0])
   */
  update(led, value) {
    return new Promise((resolve, reject) => {

      // (led - 1): The LEDs start with led 1, but the array with 0
      // * 3: Every LED can display an RGB color, so every 3 bytes in the array are one LED
      led = (led - 1) * 3

      // Multiple
      if (Array.isArray(value)) {
        this.leds.splice(led, value.length, ...value)
      
      } else {
        return reject(new Error('Could not update LEDs because the provided value is not of type number[]'))
      }

      // Send the updated leds to the controller
      return resolve(this.send(this.leds))

    })
  }

  /**
   * Disconnect from the USB device
   *
   * Note: The device is still paired to the browser!
   *
   * @return {Promise}
   * @example
   * controller.disconnect().then(() => {
   *   // Destroyed connection to USB device, but USB device is still paired with the browser
   *})
   */
  disconnect() {
    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
      // It's a USB class request
      'requestType': 'class',
      // The destination of this request is the interface
      'recipient': 'interface',
      // CDC: Communication Device Class
      // 0x22: SET_CONTROL_LINE_STATE
      // RS-232 signal used to tell the USB device that the computer is not present anymore
      'request': 0x22,
      // No
      'value': 0x01,
      // Interface #2
      'index': 0x02
    })

    // Close the connection to the USB device
    .then(() => this.device.close())
  }
}
