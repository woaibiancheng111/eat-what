function isSameDay(dateA, dateB) {
  const a = new Date(dateA)
  const b = new Date(dateB)

  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function filterMeals(meals, filters) {
  return meals.filter((meal) => {
    if (filters.onlyOpen && !meal.isOpen) {
      return false
    }

    if (meal.priceLevel > filters.maxPriceLevel) {
      return false
    }

    if (!filters.distanceLevels.includes(meal.distanceLevel)) {
      return false
    }

    if (filters.selectedTags.length > 0) {
      const hasTag = filters.selectedTags.some((tag) => meal.tags.includes(tag))
      if (!hasTag) {
        return false
      }
    }

    if (filters.excludeRecentlyEaten && meal.lastEatenAt && isSameDay(meal.lastEatenAt, new Date())) {
      return false
    }

    return true
  })
}

function getMealScore(meal) {
  const favoriteBonus = meal.isFavorite ? 2 : 0
  const freshnessBonus = meal.lastEatenAt ? 0 : 2
  const varietyBonus = Math.max(0, 3 - (meal.eatCount || 0))

  return meal.weight + favoriteBonus + freshnessBonus + varietyBonus
}

function pickMeal(meals, useWeightedPick) {
  if (meals.length === 0) {
    return null
  }

  if (!useWeightedPick) {
    const index = Math.floor(Math.random() * meals.length)
    return meals[index]
  }

  const weightedMeals = meals.map((meal) => ({
    meal,
    score: Math.max(1, getMealScore(meal))
  }))
  const totalScore = weightedMeals.reduce((sum, item) => sum + item.score, 0)
  let target = Math.random() * totalScore

  for (const item of weightedMeals) {
    target -= item.score
    if (target <= 0) {
      return item.meal
    }
  }

  return weightedMeals[weightedMeals.length - 1].meal
}

function buildRecommendation(meals, filters, settings) {
  const candidates = filterMeals(meals, filters)
  const pickedMeal = pickMeal(candidates, settings.useWeightedPick)

  return {
    candidates,
    pickedMeal
  }
}

module.exports = {
  filterMeals,
  getMealScore,
  pickMeal,
  buildRecommendation
}
