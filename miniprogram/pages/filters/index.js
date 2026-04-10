const { defaultFilters } = require('../../utils/default-data')
const { getFilters, saveFilters } = require('../../utils/storage')

const TAG_OPTIONS = ['米饭', '面食', '轻食', '清淡', '下饭', '热乎']
const DISTANCE_OPTIONS = [
  { level: 1, label: '近一点' },
  { level: 2, label: '正常走' },
  { level: 3, label: '远一点也行' }
]

function buildFilterViewModel(filters, tagOptions = TAG_OPTIONS) {
  return {
    distanceOptions: DISTANCE_OPTIONS.map((option) => ({
      ...option,
      active: filters.distanceLevels.includes(option.level)
    })),
    tagOptionItems: tagOptions.map((tag) => ({
      label: tag,
      active: filters.selectedTags.includes(tag)
    }))
  }
}

Page({
  data: {
    filters: defaultFilters,
    tagOptions: TAG_OPTIONS,
    distanceOptions: buildFilterViewModel(defaultFilters).distanceOptions,
    tagOptionItems: buildFilterViewModel(defaultFilters).tagOptionItems
  },

  onShow() {
    this.applyFilters(getFilters())
  },

  applyFilters(nextFilters) {
    this.setData({
      filters: nextFilters,
      ...buildFilterViewModel(nextFilters, this.data.tagOptions)
    })
  },

  handlePriceChange(event) {
    this.applyFilters({
      ...this.data.filters,
      maxPriceLevel: Number(event.detail.value) + 1
    })
  },

  handleDistanceToggle(event) {
    const level = Number(event.currentTarget.dataset.level)
    const current = this.data.filters.distanceLevels
    const nextDistanceLevels = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level].sort()

    this.applyFilters({
      ...this.data.filters,
      distanceLevels: nextDistanceLevels.length ? nextDistanceLevels : [1, 2, 3]
    })
  },

  handleTagToggle(event) {
    const tag = event.currentTarget.dataset.tag
    const current = this.data.filters.selectedTags
    const nextSelectedTags = current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag]

    this.applyFilters({
      ...this.data.filters,
      selectedTags: nextSelectedTags
    })
  },

  handleSwitch(event) {
    const field = event.currentTarget.dataset.field

    this.applyFilters({
      ...this.data.filters,
      [field]: event.detail.value
    })
  },

  handleReset() {
    this.applyFilters({ ...defaultFilters })
  },

  handleApply() {
    saveFilters(this.data.filters)
    wx.navigateBack()
  }
})

module.exports = {
  TAG_OPTIONS,
  DISTANCE_OPTIONS,
  buildFilterViewModel
}
