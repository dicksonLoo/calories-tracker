import type { Entry, MealType } from '../db'

export interface Suggestion {
  type: 'warning' | 'success' | 'info'
  message: string
}

function sumCalories(entries: Entry[]): number {
  return entries.reduce((s, e) => s + e.calories, 0)
}

function entriesByMeal(entries: Entry[], meal: MealType): Entry[] {
  return entries.filter(e => e.meal === meal)
}

export function getSuggestions(entries: Entry[], dailyTarget: number): Suggestion[] {
  const results: Suggestion[] = []
  const now = new Date()
  const hour = now.getHours()
  const totalLogged = sumCalories(entries)
  const remaining = dailyTarget - totalLogged
  const pct = totalLogged / dailyTarget

  // Over target
  if (totalLogged > dailyTarget) {
    results.push({
      type: 'warning',
      message: `You've exceeded your goal by ${Math.round(totalLogged - dailyTarget)} kcal today.`,
    })
    return results
  }

  // On track late in day
  if (hour >= 19 && pct >= 0.9 && pct <= 1.1) {
    results.push({
      type: 'success',
      message: `Great job — you're right on target today!`,
    })
    return results
  }

  // Front-loaded: 75%+ before noon
  if (hour < 12 && totalLogged > 0) {
    const earlyTotal = sumCalories(entries.filter(e => {
      const h = new Date(e.timestamp).getHours()
      return h < 12
    }))
    if (earlyTotal / dailyTarget > 0.75) {
      results.push({
        type: 'info',
        message: `Most of your calories are early in the day — save some for later meals.`,
      })
    }
  }

  // Meal skipped checks
  const breakfastEmpty = entriesByMeal(entries, 'breakfast').length === 0
  const lunchEmpty = entriesByMeal(entries, 'lunch').length === 0
  const dinnerEmpty = entriesByMeal(entries, 'dinner').length === 0

  if (breakfastEmpty && hour >= 10 && hour < 14) {
    results.push({
      type: 'info',
      message: `You haven't logged breakfast yet and have ${Math.round(remaining)} kcal remaining.`,
    })
  } else if (lunchEmpty && hour >= 14 && hour < 18) {
    results.push({
      type: 'info',
      message: `You haven't logged lunch yet and have ${Math.round(remaining)} kcal remaining.`,
    })
  } else if (dinnerEmpty && hour >= 20) {
    results.push({
      type: 'info',
      message: `You haven't logged dinner yet and have ${Math.round(remaining)} kcal remaining.`,
    })
  }

  // Under-eating after 18:00
  if (hour >= 18 && pct < 0.5) {
    results.push({
      type: 'warning',
      message: `You have ${Math.round(remaining)} kcal left — make sure to eat enough today.`,
    })
  }

  return results
}
