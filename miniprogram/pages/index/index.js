const { getMeals, getSettings, getFilters, getHistory, saveMeals, saveHistory } = require('../../utils/storage')
const { buildRecommendation } = require('../../services/recommend')

Page({
  data: {
    pickedMeal: null,
    candidateCount: 0,
    filters: null,
    recentMealText: ''
  },

  onShow() {
    this.refreshRecommendation()
  },

  refreshRecommendation() {
    const meals = getMeals()
    const settings = getSettings()
    const filters = getFilters()
    const history = getHistory()
    const syncedFilters = {
      ...filters,
      excludeRecentlyEaten: settings.excludeRecentlyEaten
    }
    const result = buildRecommendation(meals, syncedFilters, settings)
    const recent = history[0]

    this.setData({
      pickedMeal: result.pickedMeal,
      candidateCount: result.candidates.length,
      filters,
      recentMealText: recent ? `最近一次吃了：${recent.optionName}` : '还没有记录，今天由我来帮你做决定'
    })
  },

  handlePickAgain() {
    this.refreshRecommendation()
  },

  handleOpenFilters() {
    wx.navigateTo({
      url: '/pages/filters/index'
    })
  },

  handleOpenMeals() {
    wx.switchTab({
      url: '/pages/options/index'
    })
  },

  handleMarkEaten() {
    const { pickedMeal } = this.data
    if (!pickedMeal) {
      return
    }

    const meals = getMeals().map((meal) => (
      meal.id === pickedMeal.id
        ? { ...meal, lastEatenAt: new Date().toISOString(), eatCount: (meal.eatCount || 0) + 1 }
        : meal
    ))
    const history = [
      {
        date: new Date().toISOString(),
        optionId: pickedMeal.id,
        optionName: pickedMeal.name
      },
      ...getHistory()
    ].slice(0, 10)

    saveMeals(meals)
    saveHistory(history)
    wx.showToast({ title: '已记录', icon: 'success' })
    this.refreshRecommendation()
  }
})
