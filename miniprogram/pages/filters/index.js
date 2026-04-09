const { defaultFilters } = require('../../utils/default-data')
const { getFilters, saveFilters } = require('../../utils/storage')

Page({
  data: {
    filters: defaultFilters,
    tagOptions: ['米饭', '面食', '轻食', '清淡', '下饭', '热乎']
  },

  onShow() {
    this.setData({
      filters: getFilters()
    })
  },

  handlePriceChange(event) {
    this.setData({
      'filters.maxPriceLevel': Number(event.detail.value) + 1
    })
  },

  handleDistanceToggle(event) {
    const level = Number(event.currentTarget.dataset.level)
    const current = this.data.filters.distanceLevels
    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level].sort()

    this.setData({
      'filters.distanceLevels': next.length ? next : [1, 2, 3]
    })
  },

  handleTagToggle(event) {
    const tag = event.currentTarget.dataset.tag
    const current = this.data.filters.selectedTags
    const next = current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag]

    this.setData({
      'filters.selectedTags': next
    })
  },

  handleSwitch(event) {
    const field = event.currentTarget.dataset.field
    this.setData({
      [`filters.${field}`]: event.detail.value
    })
  },

  handleReset() {
    this.setData({ filters: { ...defaultFilters } })
  },

  handleApply() {
    saveFilters(this.data.filters)
    wx.navigateBack()
  }
})
