const { getMeals } = require('../../utils/storage')

Page({
  data: {
    meals: [],
    searchText: ''
  },

  onShow() {
    this.refreshMeals()
  },

  refreshMeals() {
    const searchText = this.data.searchText.trim()
    const meals = getMeals().filter((meal) => (
      searchText ? meal.name.includes(searchText) || meal.tags.some((tag) => tag.includes(searchText)) : true
    ))

    this.setData({ meals })
  },

  handleSearch(event) {
    const searchText = event.detail.value
    const meals = getMeals().filter((meal) => (
      searchText ? meal.name.includes(searchText) || meal.tags.some((tag) => tag.includes(searchText)) : true
    ))

    this.setData({
      searchText,
      meals
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
