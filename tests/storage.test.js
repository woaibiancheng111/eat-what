const test = require('node:test')
const assert = require('node:assert/strict')

const storage = {}

global.wx = {
  getStorageSync(key) {
    return storage[key]
  },
  setStorageSync(key, value) {
    storage[key] = value
  }
}

const {
  getMeals,
  saveMeals,
  deleteMealById,
  getSettings,
  saveSettings,
  getFilters,
  saveFilters,
  getHistory,
  saveHistory
} = require('../miniprogram/utils/storage')

test.beforeEach(() => {
  Object.keys(storage).forEach((key) => {
    delete storage[key]
  })
})

test('getMeals seeds default meals when demo data is enabled', () => {
  storage['eat-what-settings'] = { showDemoData: true }
  delete storage['eat-what-meals']

  const meals = getMeals()

  assert.ok(Array.isArray(meals))
  assert.ok(meals.length > 0)
})

test('saveMeals and getMeals roundtrip custom meals', () => {
  const meals = [{ id: 'x', name: '测试饭', tags: [], priceLevel: 1, distanceLevel: 1, isOpen: true, isFavorite: false, weight: 1, eatCount: 0, lastEatenAt: '', note: '' }]
  saveMeals(meals)
  assert.deepEqual(getMeals(), meals)
})

test('deleteMealById removes a meal and reports success', () => {
  const meals = [
    { id: 'x', name: '测试饭', tags: [], priceLevel: 1, distanceLevel: 1, isOpen: true, isFavorite: false, weight: 1, eatCount: 0, lastEatenAt: '', note: '' },
    { id: 'y', name: '保留项', tags: [], priceLevel: 1, distanceLevel: 1, isOpen: true, isFavorite: false, weight: 1, eatCount: 0, lastEatenAt: '', note: '' }
  ]

  saveMeals(meals)

  assert.equal(deleteMealById('x'), true)
  assert.deepEqual(getMeals(), [meals[1]])
  assert.equal(deleteMealById('missing'), false)
})

test('deleteMealById can remove the last meal', () => {
  saveMeals([{ id: 'x', name: '测试饭', tags: [], priceLevel: 1, distanceLevel: 1, isOpen: true, isFavorite: false, weight: 1, eatCount: 0, lastEatenAt: '', note: '' }])

  assert.equal(deleteMealById('x'), true)
  assert.deepEqual(getMeals(), [])
})

test('settings, filters, and history roundtrip', () => {
  saveSettings({ useWeightedPick: false, excludeRecentlyEaten: false, showDemoData: false })
  saveFilters({ maxPriceLevel: 1, distanceLevels: [1], selectedTags: ['米饭'], excludeRecentlyEaten: false, onlyOpen: true })
  saveHistory([{ optionId: 'x', optionName: '测试饭', date: '2026-04-06T00:00:00.000Z' }])

  assert.equal(getSettings().useWeightedPick, false)
  assert.deepEqual(getFilters().selectedTags, ['米饭'])
  assert.equal(getHistory()[0].optionName, '测试饭')
})
