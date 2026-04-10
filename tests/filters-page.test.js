const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const pagePath = path.join(__dirname, '..', 'miniprogram', 'pages', 'filters', 'index.js')
const wxmlPath = path.join(__dirname, '..', 'miniprogram', 'pages', 'filters', 'index.wxml')

let capturedPage = null

global.Page = (definition) => {
  capturedPage = definition
}

const { buildFilterViewModel, DISTANCE_OPTIONS } = require(pagePath)

const filtersWxml = fs.readFileSync(wxmlPath, 'utf8')

test('buildFilterViewModel marks active distance and tag options', () => {
  const viewModel = buildFilterViewModel({
    maxPriceLevel: 2,
    distanceLevels: [1, 3],
    selectedTags: ['米饭'],
    excludeRecentlyEaten: false,
    onlyOpen: true
  }, ['米饭', '轻食'])

  assert.deepEqual(viewModel.distanceOptions.map((item) => item.active), [true, false, true])
  assert.deepEqual(viewModel.tagOptionItems.map((item) => item.active), [true, false])
})

test('buildFilterViewModel preserves configured distance options', () => {
  assert.equal(DISTANCE_OPTIONS.length, 3)
  assert.deepEqual(DISTANCE_OPTIONS.map((item) => item.level), [1, 2, 3])
})

test('filters page template no longer calls includes in bindings', () => {
  assert.equal(filtersWxml.includes('.includes('), false)
})

test('filters page removes duplicate recently eaten switch from page filters', () => {
  assert.equal(filtersWxml.includes('data-field="excludeRecentlyEaten"'), false)
})

test('filters page registers Page definition', () => {
  assert.ok(capturedPage)
  assert.equal(typeof capturedPage.applyFilters, 'function')
})
