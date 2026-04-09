const { getMeals, saveMeals, deleteMealById } = require('../../utils/storage')

function findMealById(meals, id) {
  return meals.find((item) => item.id === id)
}

function createMealId() {
  return `meal-${Date.now()}`
}

Page({
  data: {
    id: '',
    name: '',
    tagsText: '',
    priceLevel: 1,
    distanceLevel: 1,
    isOpen: true,
    isFavorite: false,
    note: ''
  },

  onLoad(query) {
    if (!query.id) {
      return
    }

    const meal = findMealById(getMeals(), query.id)
    if (!meal) {
      return
    }

    this.setData({
      id: meal.id,
      name: meal.name,
      tagsText: meal.tags.join(' '),
      priceLevel: meal.priceLevel,
      distanceLevel: meal.distanceLevel,
      isOpen: meal.isOpen,
      isFavorite: meal.isFavorite,
      note: meal.note || ''
    })
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset
    this.setData({ [field]: event.detail.value })
  },

  handleSwitch(event) {
    const { field } = event.currentTarget.dataset
    this.setData({ [field]: event.detail.value })
  },

  handlePriceChange(event) {
    this.setData({ priceLevel: Number(event.detail.value) + 1 })
  },

  handleDistanceChange(event) {
    this.setData({ distanceLevel: Number(event.detail.value) + 1 })
  },

  handleSave() {
    const { id, name, tagsText, priceLevel, distanceLevel, isOpen, isFavorite, note } = this.data
    const trimmedName = name.trim()

    if (!trimmedName) {
      wx.showToast({ title: '请填写名称', icon: 'none' })
      return
    }

    const meals = getMeals()
    const currentMeal = findMealById(meals, id)
    if (id && !currentMeal) {
      wx.showToast({ title: '该午餐项已删除', icon: 'none' })
      return
    }

    const nextMeal = {
      id: id || createMealId(),
      name: trimmedName,
      tags: tagsText.split(/\s+/).filter(Boolean),
      priceLevel,
      distanceLevel,
      isOpen,
      isFavorite,
      weight: isFavorite ? 3 : 1,
      eatCount: currentMeal?.eatCount || 0,
      lastEatenAt: currentMeal?.lastEatenAt || '',
      note: note.trim()
    }

    const nextMeals = id
      ? meals.map((item) => (item.id === id ? nextMeal : item))
      : [nextMeal, ...meals]

    saveMeals(nextMeals)
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 300)
  },

  handleDelete() {
    const { id } = this.data
    if (!id) {
      return
    }

    wx.showModal({
      title: '删除午餐项',
      content: '删除后无法恢复，确认要删除吗？',
      confirmText: '删除',
      confirmColor: '#D94C3D',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        const deleted = deleteMealById(id)
        if (!deleted) {
          wx.showToast({ title: '删除失败', icon: 'none' })
          return
        }

        wx.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 300)
      }
    })
  }
})
