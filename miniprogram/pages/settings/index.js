const { defaultSettings } = require('../../utils/default-data')
const { getSettings, saveSettings, saveHistory, getFilters, saveFilters } = require('../../utils/storage')

Page({
  data: {
    settings: defaultSettings
  },

  onShow() {
    this.setData({
      settings: getSettings()
    })
  },

  handleSwitch(event) {
    const field = event.currentTarget.dataset.field
    const nextValue = event.detail.value
    const settings = {
      ...this.data.settings,
      [field]: nextValue
    }

    if (field === 'excludeRecentlyEaten') {
      const filters = {
        ...getFilters(),
        excludeRecentlyEaten: nextValue
      }
      saveFilters(filters)
    }

    saveSettings(settings)
    this.setData({ settings })
  },

  handleClearHistory() {
    saveHistory([])
    wx.showToast({ title: '记录已清空', icon: 'success' })
  }
})
