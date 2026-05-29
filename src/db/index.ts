import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

export type Gender = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type Goal = 'lose' | 'maintain' | 'gain'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

export interface Profile {
  id: 1
  name: string
  age: number
  weight: number
  height: number
  gender: Gender
  activityLevel: ActivityLevel
  goal: Goal
  dailyTarget: number
}

export interface CustomFood {
  id?: number
  name: string
  calories: number
}

export interface Entry {
  id?: number
  date: string
  meal: MealType
  foodName: string
  calories: number
  timestamp: number
}

interface CaloriesDB extends DBSchema {
  profile: { key: number; value: Profile }
  customFoods: { key: number; value: CustomFood & { id: number }; indexes: { 'by-name': string } }
  entries: { key: number; value: Entry & { id: number }; indexes: { 'by-date': string } }
}

let dbInstance: IDBPDatabase<CaloriesDB> | null = null

async function getDB() {
  if (!dbInstance) {
    dbInstance = await openDB<CaloriesDB>('calories-tracker', 1, {
      upgrade(db) {
        db.createObjectStore('profile', { keyPath: 'id' })

        const foods = db.createObjectStore('customFoods', { keyPath: 'id', autoIncrement: true })
        foods.createIndex('by-name', 'name')

        const entries = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true })
        entries.createIndex('by-date', 'date')
      },
    })
  }
  return dbInstance
}

export async function getProfile(): Promise<Profile | undefined> {
  const db = await getDB()
  return db.get('profile', 1)
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDB()
  await db.put('profile', profile)
}

export async function getCustomFoods(): Promise<(CustomFood & { id: number })[]> {
  const db = await getDB()
  return db.getAllFromIndex('customFoods', 'by-name')
}

export async function addCustomFood(food: CustomFood): Promise<number> {
  const db = await getDB()
  return db.add('customFoods', food as CustomFood & { id: number })
}

export async function deleteCustomFood(id: number): Promise<void> {
  const db = await getDB()
  await db.delete('customFoods', id)
}

export async function getEntries(date: string): Promise<(Entry & { id: number })[]> {
  const db = await getDB()
  return db.getAllFromIndex('entries', 'by-date', date)
}

export async function getAllEntries(): Promise<(Entry & { id: number })[]> {
  const db = await getDB()
  return db.getAll('entries')
}

export async function addEntry(entry: Entry): Promise<number> {
  const db = await getDB()
  return db.add('entries', entry as Entry & { id: number })
}

export async function deleteEntry(id: number): Promise<void> {
  const db = await getDB()
  await db.delete('entries', id)
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('profile')
  await db.clear('customFoods')
  await db.clear('entries')
}
