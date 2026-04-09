const test = require('node:test')
const assert = require('node:assert/strict')

const { filterMeals, getMealScore, pickMeal, buildRecommendation } = require('../miniprogram/services/recommend')

const sampleMeals = [
  {
    id: '1',
    name: '黄焖鸡',
    tags: ['米饭', '下饭'],
    priceLevel: 1,
    distanceLevel: 1,
    isOpen: true,
    isFavorite: true,
    weight: 3,
    eatCount: 2,
    lastEatenAt: '',
    note: ''
  },
  {
    id: '2',
    name: '轻食沙拉',
    tags: ['轻食', '清淡'],
    priceLevel: 2,
    distanceLevel: 2,
    isOpen: true,
    isFavorite: false,
    weight: 1,
    eatCount: 0,
    lastEatenAt: '',
    note: ''
  },
  {
    id: '3',
    name: '烤肉饭',
    tags: ['米饭'],
    priceLevel: 3,
    distanceLevel: 3,
    isOpen: false,
    isFavorite: false,
    weight: 1,
    eatCount: 4,
    lastEatenAt: new Date().toISOString(),
    note: ''
  }
]

test('filterMeals filters by open status, price, distance and tags', () => {
  const result = filterMeals(sampleMeals, {
    maxPriceLevel: 2,
    distanceLevels: [1, 2],
    selectedTags: ['轻食'],
    excludeRecentlyEaten: true,
    onlyOpen: true
  })

  assert.equal(result.length, 1)
  assert.equal(result[0].id, '2')
})

test('getMealScore prefers favorites and variety', () => {
  assert.ok(getMealScore(sampleMeals[0]) > getMealScore(sampleMeals[2]))
})

test('pickMeal returns null for empty list', () => {
  assert.equal(pickMeal([], true), null)
})

test('pickMeal returns deterministic item when Math.random is stubbed', () => {
  const originalRandom = Math.random
  Math.random = () => 0

  const picked = pickMeal(sampleMeals.slice(0, 2), false)

  Math.random = originalRandom
  assert.equal(picked.id, '1')
})

test('buildRecommendation returns filtered candidates and one picked meal', () => {
  const originalRandom = Math.random
  Math.random = () => 0.2

  const result = buildRecommendation(sampleMeals, {
    maxPriceLevel: 2,
    distanceLevels: [1, 2],
    selectedTags: [],
    excludeRecentlyEaten: true,
    onlyOpen: true
  }, {
    useWeightedPick: true
  })

  Math.random = originalRandom
  assert.equal(result.candidates.length, 2)
  assert.ok(result.pickedMeal)
})
