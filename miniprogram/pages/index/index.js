const { getMeals, getSettings, getFilters, getHistory, saveMeals, saveHistory } = require('../../utils/storage')
const { buildRecommendation } = require('../../services/recommend')

const DEFAULT_PICKED_MEAL_NOTE = '今天适合吃点合胃口的，先吃顿顺心的。'
const DEFAULT_RECENT_MEAL_TEXT = '暂无记录'

Page({
  data: {
    pickedMeal: null,
    pickedMealNote: '',
    pickedMealTags: [],
    candidateCount: 0,
    totalMealCount: 0,
    filters: null,
    recentMealText: DEFAULT_RECENT_MEAL_TEXT,
    hasPickedMeal: false,
    showCandidateEmpty: false,
    showLibraryEmpty: true,
    showOverview: false
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
    const hasPickedMeal = Boolean(result.pickedMeal)
    const candidateCount = result.candidates.length
    const totalMealCount = meals.length

    this.setData({
      pickedMeal: result.pickedMeal,
      pickedMealNote: hasPickedMeal ? (result.pickedMeal.note || DEFAULT_PICKED_MEAL_NOTE) : '',
      pickedMealTags: hasPickedMeal && Array.isArray(result.pickedMeal.tags) ? result.pickedMeal.tags : [],
      candidateCount,
      totalMealCount,
      filters,
      recentMealText: recent ? recent.optionName : DEFAULT_RECENT_MEAL_TEXT,
      hasPickedMeal,
      showCandidateEmpty: !hasPickedMeal && totalMealCount > 0,
      showLibraryEmpty: totalMealCount === 0,
      showOverview: candidateCount > 0
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
