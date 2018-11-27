import Controller from '../controller.js'

test('Use controller with default arguments', () => {
  const controller = new Controller({ leds: 30 })

  // Device not defined
  expect(controller.device).toBe(undefined)

  // leds is an array with 30 leds
  expect(Array.isArray(controller.leds)).toBe(true)
  expect(controller.leds.length).toBe(30 * 3)

  // Filters is an array with 7 filtered devices
  expect(Array.isArray(controller.filters)).toBe(true)
  expect(controller.filters.length).toBe(7)
})



test('Use controller with custom arguments (device, leds and filters)', () => {
  const controller = new Controller({
    filters: [],
    leds: 10,
    device: {}
  })

  expect(controller.filters).toEqual([])
  expect(controller.leds.length).toEqual(10 * 3)
  expect(controller.device).toEqual({})
})



test('Arduino Leonardo is allowed', () => {
  const controller = new Controller({ leds: 30 })

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2341, productId: 0x8036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2341, productId: 0x0036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x8036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x0036 })
  )
})



test('Arduino Leonardo ETH is allowed', () => {
  const controller = new Controller({ leds: 30 })

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x0040 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x8040 })
  )
})



test('Seeeduino Lite is allowed', () => {
  const controller = new Controller({ leds: 30 })

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2886, productId: 0x8002 })
  )
})
