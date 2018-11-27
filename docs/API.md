# API documentation


* [Controller](#module_Controller)
    * [.enable()](#module_Controller+enable) ⇒ <code>Promise</code>
    * [.getPairedDevice()](#module_Controller+getPairedDevice) ⇒ <code>Promise</code>
    * [.autoConnect()](#module_Controller+autoConnect) ⇒ <code>Promise</code>
    * [.connect()](#module_Controller+connect) ⇒ <code>Promise</code>
    * [.readLoop()](#module_Controller+readLoop) ⇒ <code>Promise</code>
    * [.send(data)](#module_Controller+send) ⇒ <code>Promise</code>
    * [.update(led, value)](#module_Controller+update)
    * [.disconnect()](#module_Controller+disconnect) ⇒ <code>Promise</code>

<a name="module_Controller"></a>

## Controller
The controller is creating a connection to the USB device (Arduino) to send data over WebUSB.
By using the default <code>args</code> you will only see the following Arduino in the user prompt:
- Arduino Leonardo
- Arduino Leonardo ETH
- Seeeduino Lite


| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | Arguments to configure the controller |
| args.filters | <code>Array.&lt;Object&gt;</code> | List of devices that are whitelisted when opening the user prompt to select an Arduino |
| args.device | <code>Object</code> | The selected Arduino to use as the controller |
| args.leds | <code>Array.&lt;number&gt;</code> | Holds all the values for each led of the leds |

**Example**  
```js
import Controller from 'webusb-neopixel-controller/controller.js'

// Create a new controller using the default properties
const controller = new Controller()
```
<a name="module_Controller+enable"></a>

### controller.enable() ⇒ <code>Promise</code>
Enable WebUSB and save the selected Arduino into <code>controller.device</code>

Note: This function has to be triggered by a user gesture

**Example**  
```js
controller.enable().then(() => {
  // Create a connection to the selected Arduino
  controller.connect().then(() => {
    // Successfully created a connection
  })
})
.catch(error => {
  // No Arduino was selected by the user
})
```
<a name="module_Controller+getPairedDevice"></a>

### controller.getPairedDevice() ⇒ <code>Promise</code>
Get a USB device that was already paired with the browser.

<a name="module_Controller+autoConnect"></a>

### controller.autoConnect() ⇒ <code>Promise</code>
Automatically connect to a USB device that was already paired with the Browser and save it into <code>controller.device</code>

**Example**  
```js
controller.autoConnect()
  .then(() => {
    // Connected to already paired Arduino
  })
  .catch(error => {
    // Nothing found or found paired Arduino, but it's not connected to computer
  })
```
<a name="module_Controller+connect"></a>

### controller.connect() ⇒ <code>Promise</code>
Open a connection to the selected USB device and tell the device that
we are ready to send data to it.

**Example**  
```js
controller.connect().then(() => {
  // Successfully created a connection to the selected Arduino
})
```
<a name="module_Controller+readLoop"></a>

### controller.readLoop() ⇒ <code>Promise</code>
Read data from the NeoPixel Controller

<a name="module_Controller+send"></a>

### controller.send(data) ⇒ <code>Promise</code>
Send data to the USB device to update the leds


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | List containing all leds that should be updated |

**Example**  
```js
controller.send([255, 0, 0])
```
<a name="module_Controller+update"></a>

### controller.update(led, value)
Update the <code>led</code>(s) of the leds with the provided <code>value</code>


| Param | Type | Description |
| --- | --- | --- |
| led | <code>number</code> | The led to update |
| value | <code>number</code> \| <code>Array.&lt;number&gt;</code> | The value to update the led, supporting two different modes: single (= <code>number</code>) & multi (= <code>Array</code>) |

**Example** *(Update a single led)*  
```js
// Update led #1 with color red (rgb(255, 0, 0))
controller.update(1, [255, 0, 0])
```
**Example** *(Update multiple leds starting with led)*  
```js
// Update led #5 with red (rgb(255, 0, 0)), #6 with green (rgb(0, 255, 0))
controller.update(5, [255, 0, 0, 0, 255, 0])
```
<a name="module_Controller+disconnect"></a>

### controller.disconnect() ⇒ <code>Promise</code>
Disconnect from the USB device

Note: The device is still paired to the browser!

**Example**  
```js
controller.disconnect().then(() => {
  // Destroyed connection to USB device, but USB device is still paired with the browser
})
```
