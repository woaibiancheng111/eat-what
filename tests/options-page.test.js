const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const pagePath = path.join(__dirname, '..', 'miniprogram', 'pages', 'options', 'index.js')
const wxmlPath = path.join(__dirname, '..', 'miniprogram', 'pages', 'options', 'index.wxml')

let capturedPage = null

global.Page = (definition) => {
  capturedPage = definition
}

const {
  normalizeMealTags,
  filterMealsBySearch,
  formatLastEatenLabel,
  formatEatCountLabel,
  mapMealsForView
} = require(pagePath)

const optionsWxml = fs.readFileSync(wxmlPath, 'utf8')

test('normalizeMealTags keeps only non-empty strings', () => {
  assert.deepEqual(normalizeMealTags([' 面食 ', '', null, '热乎']), ['面食', '热乎'])
  assert.deepEqual(normalizeMealTags(null), [])
})

test('filterMealsBySearch returns all meals when keyword is empty', () => {
  const meals = [
    { name: '牛肉面', tags: ['面食'] },
    { name: '轻食沙拉', tags: ['轻食', '清淡'] }
  ]

  assert.deepEqual(filterMealsBySearch(meals, '  '), meals)
})

test('filterMealsBySearch returns matching meals by name or tag', () => {
  const meals = [
    { name: '牛肉面', tags: ['面食'] },
    { name: '轻食沙拉', tags: ['轻食', '清淡'] }
  ]

  assert.deepEqual(filterMealsBySearch(meals, '牛肉').map((meal) => meal.name), ['牛肉面'])
  assert.deepEqual(filterMealsBySearch(meals, '清淡').map((meal) => meal.name), ['轻食沙拉'])
})

test('format helpers return readable labels', () => {
  assert.equal(formatLastEatenLabel(''), '还没记录')
  assert.equal(formatLastEatenLabel('2026-04-10T12:30:00.000Z'), '2026-04-10')
  assert.equal(formatEatCountLabel(0), '0')
  assert.equal(formatEatCountLabel(3), '3')
})

test('mapMealsForView precomputes template-safe fields', () => {
  const result = mapMealsForView([{ id: '1', tags: ['面食', '热乎', '微辣'], eatCount: 3, lastEatenAt: '2026-04-10T12:30:00.000Z' }])

  assert.equal(result[0].lastEatenLabel, '2026-04-10')
  assert.equal(result[0].eatCountLabel, '3')
  assert.equal(result[0].primaryTag, '面食')
  assert.deepEqual(result[0].secondaryTags, [
    { id: '1-tag-0', label: '热乎' },
    { id: '1-tag-1', label: '微辣' }
  ])
})

test('mapMealsForView tolerates malformed storage records', () => {
  const result = mapMealsForView([{ id: 'broken', name: null, tags: null, eatCount: null, lastEatenAt: '' }])

  assert.equal(result[0].name, '未命名午餐')
  assert.equal(result[0].primaryTag, '未分类')
  assert.deepEqual(result[0].secondaryTags, [])
})

test('options page uses explicit boolean flags for empty states', () => {
  assert.ok(optionsWxml.includes('wx:if="{{hasMeals}}"'))
  assert.ok(optionsWxml.includes('wx:if="{{showSearchEmpty}}"'))
  assert.ok(optionsWxml.includes('wx:if="{{showLibraryEmpty}}"'))
  assert.equal(optionsWxml.includes('wx:elif'), false)
})

test('options page no longer uses inline slice or fallback expressions in bindings', () => {
  assert.equal(optionsWxml.includes('.slice('), false)
  assert.equal(optionsWxml.includes('||'), false)
})

test('options page uses stable secondary tag keys', () => {
  assert.ok(optionsWxml.includes('wx:key="id"'))
})

test('options page registers Page definition', () => {
  assert.ok(capturedPage)
  assert.equal(typeof capturedPage.refreshMeals, 'function')
})
