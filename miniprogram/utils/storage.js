const { defaultMeals, defaultSettings, defaultFilters } = require('./default-data')

const STORAGE_KEYS = {
  meals: 'eat-what-meals',
  settings: 'eat-what-settings',
  filters: 'eat-what-filters',
  history: 'eat-what-history'
}

function safeGet(key, fallback) {
  try {
    const value = wx.getStorageSync(key)
    return value === '' || value === undefined || value === null ? fallback : value
  } catch (error) {
    return fallback
  }
}

function safeSet(key, value) {
  wx.setStorageSync(key, value)
}

function getMeals() {
  const meals = safeGet(STORAGE_KEYS.meals, null)
  if (Array.isArray(meals)) {
    return meals
  }

  const settings = getSettings()
  const initialMeals = settings.showDemoData ? defaultMeals : []
  safeSet(STORAGE_KEYS.meals, initialMeals)
  return initialMeals
}

function saveMeals(meals) {
  safeSet(STORAGE_KEYS.meals, meals)
}

function deleteMealById(mealId) {
  const meals = getMeals()
  const nextMeals = meals.filter((meal) => meal.id !== mealId)

  if (nextMeals.length === meals.length) {
    return false
  }

  saveMeals(nextMeals)
  return true
}

function getSettings() {
  const settings = safeGet(STORAGE_KEYS.settings, null)
  if (settings && typeof settings === 'object') {
    return { ...defaultSettings, ...settings }
  }

  safeSet(STORAGE_KEYS.settings, defaultSettings)
  return defaultSettings
}

function saveSettings(settings) {
  safeSet(STORAGE_KEYS.settings, settings)
}

function getFilters() {
  const filters = safeGet(STORAGE_KEYS.filters, null)
  if (filters && typeof filters === 'object') {
    return { ...defaultFilters, ...filters }
  }

  safeSet(STORAGE_KEYS.filters, defaultFilters)
  return defaultFilters
}

function saveFilters(filters) {
  safeSet(STORAGE_KEYS.filters, filters)
}

function getHistory() {
  const history = safeGet(STORAGE_KEYS.history, [])
  return Array.isArray(history) ? history : []
}

function saveHistory(history) {
  safeSet(STORAGE_KEYS.history, history)
}

module.exports = {
  STORAGE_KEYS,
  getMeals,
  saveMeals,
  deleteMealById,
  getSettings,
  saveSettings,
  getFilters,
  saveFilters,
  getHistory,
  saveHistory
}
