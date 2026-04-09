const defaultMeals = [
  {
    id: 'meal-1',
    name: '黄焖鸡米饭',
    tags: ['米饭', '下饭'],
    priceLevel: 1,
    distanceLevel: 1,
    isOpen: true,
    isFavorite: true,
    weight: 3,
    eatCount: 4,
    lastEatenAt: '',
    note: '稳妥不踩雷'
  },
  {
    id: 'meal-2',
    name: '红烧牛肉面',
    tags: ['面食', '热乎'],
    priceLevel: 2,
    distanceLevel: 2,
    isOpen: true,
    isFavorite: false,
    weight: 2,
    eatCount: 2,
    lastEatenAt: '',
    note: '适合阴天'
  },
  {
    id: 'meal-3',
    name: '轻食沙拉',
    tags: ['轻食', '清淡'],
    priceLevel: 2,
    distanceLevel: 1,
    isOpen: true,
    isFavorite: false,
    weight: 1,
    eatCount: 1,
    lastEatenAt: '',
    note: '想吃清爽点的时候'
  }
]

const defaultSettings = {
  useWeightedPick: true,
  excludeRecentlyEaten: true,
  showDemoData: true
}

const defaultFilters = {
  maxPriceLevel: 3,
  distanceLevels: [1, 2, 3],
  selectedTags: [],
  excludeRecentlyEaten: true,
  onlyOpen: true
}

module.exports = {
  defaultMeals,
  defaultSettings,
  defaultFilters
}
