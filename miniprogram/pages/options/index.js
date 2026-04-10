const { getMeals } = require('../../utils/storage')

function normalizeMealTags(tags) {
  return Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim())
    : []
}

function filterMealsBySearch(meals, searchText) {
  const keyword = searchText.trim()

  return meals.filter((meal) => {
    const tags = normalizeMealTags(meal.tags)
    const mealName = typeof meal.name === 'string' ? meal.name : ''

    return keyword ? mealName.includes(keyword) || tags.some((tag) => tag.includes(keyword)) : true
  })
}

function formatLastEatenLabel(lastEatenAt) {
  if (!lastEatenAt) {
    return '还没记录'
  }

  return lastEatenAt.split('T')[0] || '还没记录'
}

function formatEatCountLabel(eatCount) {
  return String(eatCount || 0)
}

function mapMealsForView(meals) {
  return meals.map((meal) => {
    const tags = normalizeMealTags(meal.tags)

    return {
      ...meal,
      name: typeof meal.name === 'string' ? meal.name : '未命名午餐',
      tags,
      lastEatenLabel: formatLastEatenLabel(meal.lastEatenAt),
      eatCountLabel: formatEatCountLabel(meal.eatCount),
      primaryTag: tags[0] || '未分类',
      secondaryTags: tags.slice(1, 3).map((tag, index) => ({
        id: `${meal.id || 'meal'}-tag-${index}`,
        label: tag
      }))
    }
  })
}

Page({
  data: {
    meals: [],
    searchText: '',
    totalMealCount: 0,
    hasMeals: false,
    showSearchEmpty: false,
    showLibraryEmpty: true
  },

  onShow() {
    this.refreshMeals()
  },

  refreshMeals() {
    const allMeals = getMeals()
    const meals = mapMealsForView(filterMealsBySearch(allMeals, this.data.searchText))

    this.setData({
      meals,
      totalMealCount: allMeals.length,
      hasMeals: meals.length > 0,
      showSearchEmpty: meals.length === 0 && allMeals.length > 0,
      showLibraryEmpty: allMeals.length === 0
    })
  },

  handleSearch(event) {
    const searchText = event.detail.value
    const allMeals = getMeals()
    const meals = mapMealsForView(filterMealsBySearch(allMeals, searchText))

    this.setData({
      searchText,
      meals,
      totalMealCount: allMeals.length,
      hasMeals: meals.length > 0,
      showSearchEmpty: meals.length === 0 && allMeals.length > 0,
      showLibraryEmpty: allMeals.length === 0
    })
  },

  handleCreate() {
    wx.navigateTo({ url: '/pages/meal-form/index' })
  },

  handleEdit(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({ url: `/pages/meal-form/index?id=${id}` })
  }
})

module.exports = {
  normalizeMealTags,
  filterMealsBySearch,
  formatLastEatenLabel,
  formatEatCountLabel,
  mapMealsForView
}
