#include <Adafruit_NeoPixel.h>
#include <WebUSB.h>

// Whitelisted URLs
WebUSB WebUSBSerial(1, "nerddisco.github.io/webusb-neopixel-controller");
#define Serial WebUSBSerial

#define PIN_NEOPIXEL_DATAIN 6

// Amount of LEDs
#define NEOPIXEL_AMOUNT 60
#define COLORS NEOPIXEL_AMOUNT * 3

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NEOPIXEL_AMOUNT, PIN_NEOPIXEL_DATAIN, NEO_GRB + NEO_KHZ800);

// Store the incoming WebUSB bytes
byte incoming[COLORS];

// Run once on startup
void setup() {
  // Initialize incoming with 0
  memset(incoming, 0, sizeof(incoming));

  // Wait until WebUSB connection is established
  while (!Serial) {
    ;
  }

  Serial.begin(9600);

  // Send the amount of LEDs back
  Serial.write(NEOPIXEL_AMOUNT);
  Serial.flush();

  // NeoPixel
  strip.begin();
  // Initialize all pixels to 'off' = black
  strip.show(); 
}

// Run over and over again
void loop() {
  // WebUSB is available
  if (Serial && Serial.available() > 0) {

    // Read incoming bytes
    Serial.readBytes(incoming, COLORS);

    int position = 0;

    // Iterate over all leds
    for (int i = 0; i < NEOPIXEL_AMOUNT; i++) {

      position = i * 3;
      
      // Set the value for each led
      strip.setPixelColor(i, strip.Color(incoming[position], incoming[position + 1], incoming[position + 2]));

      //Serial.write(incoming[position]);
      //Serial.write(incoming[position + 1]);
      //Serial.write(incoming[position + 2]);
    }

    strip.show();

    //Serial.flush();
  }
}
