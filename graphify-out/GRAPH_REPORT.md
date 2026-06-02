# Graph Report - .  (2026-06-02)

## Corpus Check
- Corpus is ~7,385 words - fits in a single context window. You may not need a graph.

## Summary
- 123 nodes · 219 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Meal Display Components|Meal Display Components]]
- [[_COMMUNITY_Food Entry & Data Layer|Food Entry & Data Layer]]
- [[_COMMUNITY_BMR & Calorie Calculation|BMR & Calorie Calculation]]
- [[_COMMUNITY_App Shell & Navigation|App Shell & Navigation]]
- [[_COMMUNITY_Core Data Types & DB API|Core Data Types & DB API]]
- [[_COMMUNITY_Charts & Date Utilities|Charts & Date Utilities]]
- [[_COMMUNITY_Routing & Layout|Routing & Layout]]
- [[_COMMUNITY_Hero Design Assets|Hero Design Assets]]
- [[_COMMUNITY_React Framework|React Framework]]
- [[_COMMUNITY_Vite Build Tool|Vite Build Tool]]
- [[_COMMUNITY_BMR Utilities Module|BMR Utilities Module]]
- [[_COMMUNITY_Suggestion Engine Module|Suggestion Engine Module]]

## God Nodes (most connected - your core abstractions)
1. `getDB()` - 11 edges
2. `Home Page` - 11 edges
3. `App Component` - 8 edges
4. `Charts Page` - 8 edges
5. `MealType` - 7 edges
6. `AddFoodModal Component` - 7 edges
7. `Profile Page` - 7 edges
8. `Profile Data Type` - 7 edges
9. `Entry` - 6 edges
10. `getProfile()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `MealType`  [EXTRACTED]
  components/AddFoodModal.tsx → db/index.ts
- `Props` --references--> `MealType`  [EXTRACTED]
  components/MealSection.tsx → db/index.ts
- `Props` --references--> `Entry`  [EXTRACTED]
  components/MealSection.tsx → db/index.ts
- `Props` --references--> `Suggestion`  [EXTRACTED]
  components/SuggestionBanner.tsx → lib/suggestions.ts
- `Home()` --calls--> `todayDate()`  [EXTRACTED]
  pages/Home.tsx → lib/bmr.ts

## Hyperedges (group relationships)
- **Home Page Render Pipeline** — pages_Home, lib_getSuggestions, components_DailyRing, components_SuggestionBanner, components_MealSection [EXTRACTED 1.00]
- **Profile Calculation and Persistence Flow** — pages_Onboarding, lib_calculateDailyTarget, db_saveProfile [EXTRACTED 1.00]
- **Food Entry Logging Lifecycle** — components_AddFoodModal, db_addEntry, db_addCustomFood [EXTRACTED 1.00]

## Communities (12 total, 5 thin omitted)

### Community 0 - "Meal Display Components"
Cohesion: 0.12
Nodes (17): Props, MEAL_ICONS, MEAL_LABELS, Props, BG, COLORS, ICONS, Props (+9 more)

### Community 1 - "Food Entry & Data Layer"
Cohesion: 0.20
Nodes (16): MEAL_LABELS, Props, addCustomFood(), addEntry(), CaloriesDB, clearAllData(), CustomFood, deleteCustomFood() (+8 more)

### Community 2 - "BMR & Calorie Calculation"
Cohesion: 0.16
Nodes (14): ActivityLevel, Gender, Goal, ACTIVITY_MULTIPLIERS, calculateBMR(), calculateDailyTarget(), GOAL_OFFSETS, ACTIVITY_OPTIONS (+6 more)

### Community 3 - "App Shell & Navigation"
Cohesion: 0.18
Nodes (18): App Component, Layout Wrapper Component, BottomNav Component, DailyRing Component, Profile Data Type, clearAllData DB Function, getAllEntries DB Function, getProfile DB Function (+10 more)

### Community 4 - "Core Data Types & DB API"
Cohesion: 0.18
Nodes (16): AddFoodModal Component, MealSection Component, SuggestionBanner Component, CustomFood Data Type, Entry Data Type, MealType Union Type, addCustomFood DB Function, addEntry DB Function (+8 more)

### Community 5 - "Charts & Date Utilities"
Cohesion: 0.24
Nodes (7): Profile, getLast30Days(), getLast7Days(), Charts(), MEAL_COLORS, Tab, TOOLTIP_STYLE

### Community 7 - "Hero Design Assets"
Cohesion: 1.00
Nodes (3): Purple Gradient Accent Design Language, Isometric Layered Card Illustration, Hero Image Asset

## Knowledge Gaps
- **38 isolated node(s):** `MEAL_LABELS`, `NAV`, `Props`, `MEAL_ICONS`, `MEAL_LABELS` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Home Page` connect `Core Data Types & DB API` to `App Shell & Navigation`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `App Component` connect `App Shell & Navigation` to `Core Data Types & DB API`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `MEAL_LABELS`, `NAV`, `Props` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Meal Display Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._