export interface DefaultFood {
  name: string
  category: string
  units: { label: string; kcalPer: number }[]
}

export const DEFAULT_FOODS: DefaultFood[] = [
  // Grains & Carbs
  { name: 'White Rice', category: 'Grains', units: [{ label: 'bowl', kcalPer: 230 }, { label: 'cup', kcalPer: 206 }, { label: 'g', kcalPer: 1.3 }] },
  { name: 'Brown Rice', category: 'Grains', units: [{ label: 'bowl', kcalPer: 215 }, { label: 'cup', kcalPer: 195 }, { label: 'g', kcalPer: 1.12 }] },
  { name: 'White Bread', category: 'Grains', units: [{ label: 'slice', kcalPer: 79 }, { label: 'piece', kcalPer: 79 }] },
  { name: 'Wholemeal Bread', category: 'Grains', units: [{ label: 'slice', kcalPer: 69 }, { label: 'piece', kcalPer: 69 }] },
  { name: 'Instant Noodles', category: 'Grains', units: [{ label: 'packet', kcalPer: 380 }, { label: 'g', kcalPer: 4.38 }] },
  { name: 'Pasta (cooked)', category: 'Grains', units: [{ label: 'cup', kcalPer: 220 }, { label: 'plate', kcalPer: 350 }, { label: 'g', kcalPer: 1.31 }] },
  { name: 'Oats', category: 'Grains', units: [{ label: 'cup', kcalPer: 307 }, { label: 'bowl', kcalPer: 200 }, { label: 'g', kcalPer: 3.89 }] },
  { name: 'Corn on the Cob', category: 'Grains', units: [{ label: 'ear', kcalPer: 90 }, { label: 'cup (kernels)', kcalPer: 132 }] },
  { name: 'Chapati / Roti', category: 'Grains', units: [{ label: 'piece', kcalPer: 101 }] },
  { name: 'White Rice Porridge', category: 'Grains', units: [{ label: 'bowl', kcalPer: 130 }, { label: 'cup', kcalPer: 100 }] },

  // Starchy Vegetables
  { name: 'Potato', category: 'Starchy Veg', units: [{ label: 'medium', kcalPer: 130 }, { label: 'large', kcalPer: 195 }, { label: 'g', kcalPer: 0.77 }] },
  { name: 'Sweet Potato', category: 'Starchy Veg', units: [{ label: 'medium', kcalPer: 112 }, { label: 'large', kcalPer: 162 }, { label: 'g', kcalPer: 0.86 }] },
  { name: 'Cassava (Tapioca)', category: 'Starchy Veg', units: [{ label: 'cup', kcalPer: 330 }, { label: 'g', kcalPer: 1.6 }] },

  // Proteins — Meat
  { name: 'Chicken Breast', category: 'Protein', units: [{ label: 'piece (100g)', kcalPer: 165 }, { label: 'g', kcalPer: 1.65 }] },
  { name: 'Chicken Thigh', category: 'Protein', units: [{ label: 'piece', kcalPer: 210 }, { label: 'g', kcalPer: 2.09 }] },
  { name: 'Beef (lean)', category: 'Protein', units: [{ label: '100g serving', kcalPer: 250 }, { label: 'g', kcalPer: 2.5 }] },
  { name: 'Pork (lean)', category: 'Protein', units: [{ label: '100g serving', kcalPer: 242 }, { label: 'g', kcalPer: 2.42 }] },
  { name: 'Fried Chicken', category: 'Protein', units: [{ label: 'piece', kcalPer: 246 }, { label: 'g', kcalPer: 2.85 }] },

  // Proteins — Seafood
  { name: 'Salmon', category: 'Protein', units: [{ label: 'fillet', kcalPer: 208 }, { label: 'g', kcalPer: 2.08 }] },
  { name: 'Tuna (canned)', category: 'Protein', units: [{ label: 'can', kcalPer: 150 }, { label: 'g', kcalPer: 1.2 }] },
  { name: 'Shrimp / Prawn', category: 'Protein', units: [{ label: '100g', kcalPer: 99 }, { label: 'g', kcalPer: 0.99 }] },
  { name: 'Fish Fillet', category: 'Protein', units: [{ label: 'fillet', kcalPer: 180 }, { label: 'g', kcalPer: 1.7 }] },
  { name: 'Sardines (canned)', category: 'Protein', units: [{ label: 'can', kcalPer: 190 }, { label: 'g', kcalPer: 2.08 }] },

  // Proteins — Eggs & Plant
  { name: 'Egg', category: 'Protein', units: [{ label: 'egg', kcalPer: 78 }, { label: 'large egg', kcalPer: 90 }] },
  { name: 'Tofu', category: 'Protein', units: [{ label: 'block', kcalPer: 180 }, { label: 'cup', kcalPer: 188 }, { label: 'g', kcalPer: 0.76 }] },
  { name: 'Tempeh', category: 'Protein', units: [{ label: '100g', kcalPer: 193 }, { label: 'slice', kcalPer: 55 }, { label: 'g', kcalPer: 1.93 }] },

  // Vegetables
  { name: 'Broccoli', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 55 }, { label: 'g', kcalPer: 0.34 }] },
  { name: 'Carrot', category: 'Vegetables', units: [{ label: 'medium', kcalPer: 25 }, { label: 'cup', kcalPer: 52 }, { label: 'g', kcalPer: 0.41 }] },
  { name: 'Spinach', category: 'Vegetables', units: [{ label: 'cup (raw)', kcalPer: 7 }, { label: 'cup (cooked)', kcalPer: 41 }, { label: 'g', kcalPer: 0.23 }] },
  { name: 'Cabbage', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 22 }, { label: 'g', kcalPer: 0.25 }] },
  { name: 'Cucumber', category: 'Vegetables', units: [{ label: 'medium', kcalPer: 16 }, { label: 'cup (sliced)', kcalPer: 16 }, { label: 'g', kcalPer: 0.15 }] },
  { name: 'Tomato', category: 'Vegetables', units: [{ label: 'medium', kcalPer: 22 }, { label: 'cup', kcalPer: 32 }, { label: 'g', kcalPer: 0.18 }] },
  { name: 'Onion', category: 'Vegetables', units: [{ label: 'medium', kcalPer: 44 }, { label: 'g', kcalPer: 0.4 }] },
  { name: 'Mushroom', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 15 }, { label: 'g', kcalPer: 0.22 }] },
  { name: 'Bean Sprouts', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 26 }, { label: 'g', kcalPer: 0.3 }] },
  { name: 'Long Bean', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 44 }, { label: 'g', kcalPer: 0.47 }] },
  { name: 'Kangkung (Water Spinach)', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 20 }, { label: 'g', kcalPer: 0.19 }] },
  { name: 'Eggplant / Brinjal', category: 'Vegetables', units: [{ label: 'cup', kcalPer: 20 }, { label: 'g', kcalPer: 0.25 }] },

  // Fruits
  { name: 'Banana', category: 'Fruits', units: [{ label: 'banana', kcalPer: 89 }, { label: 'large banana', kcalPer: 121 }] },
  { name: 'Apple', category: 'Fruits', units: [{ label: 'apple', kcalPer: 95 }, { label: 'large apple', kcalPer: 130 }] },
  { name: 'Orange', category: 'Fruits', units: [{ label: 'orange', kcalPer: 62 }, { label: 'large orange', kcalPer: 86 }] },
  { name: 'Watermelon', category: 'Fruits', units: [{ label: 'slice', kcalPer: 86 }, { label: 'cup', kcalPer: 46 }, { label: 'g', kcalPer: 0.3 }] },
  { name: 'Grapes', category: 'Fruits', units: [{ label: 'cup', kcalPer: 104 }, { label: 'g', kcalPer: 0.69 }] },
  { name: 'Mango', category: 'Fruits', units: [{ label: 'mango', kcalPer: 135 }, { label: 'cup', kcalPer: 99 }, { label: 'g', kcalPer: 0.6 }] },
  { name: 'Pineapple', category: 'Fruits', units: [{ label: 'slice', kcalPer: 42 }, { label: 'cup', kcalPer: 82 }, { label: 'g', kcalPer: 0.5 }] },
  { name: 'Durian', category: 'Fruits', units: [{ label: 'seed (flesh)', kcalPer: 57 }, { label: 'cup', kcalPer: 357 }, { label: 'g', kcalPer: 1.47 }] },
  { name: 'Papaya', category: 'Fruits', units: [{ label: 'cup', kcalPer: 55 }, { label: 'slice', kcalPer: 59 }, { label: 'g', kcalPer: 0.43 }] },
  { name: 'Guava', category: 'Fruits', units: [{ label: 'guava', kcalPer: 37 }, { label: 'cup', kcalPer: 112 }] },

  // Dairy
  { name: 'Whole Milk', category: 'Dairy', units: [{ label: 'glass (250ml)', kcalPer: 150 }, { label: 'cup', kcalPer: 150 }, { label: 'ml', kcalPer: 0.61 }] },
  { name: 'Skim Milk', category: 'Dairy', units: [{ label: 'glass (250ml)', kcalPer: 90 }, { label: 'cup', kcalPer: 90 }, { label: 'ml', kcalPer: 0.35 }] },
  { name: 'Yogurt (plain)', category: 'Dairy', units: [{ label: 'cup', kcalPer: 150 }, { label: 'g', kcalPer: 0.61 }] },
  { name: 'Yogurt (flavoured)', category: 'Dairy', units: [{ label: 'cup', kcalPer: 230 }, { label: 'tub (150g)', kcalPer: 175 }] },
  { name: 'Cheddar Cheese', category: 'Dairy', units: [{ label: 'slice', kcalPer: 113 }, { label: 'g', kcalPer: 4.02 }] },
  { name: 'Butter', category: 'Dairy', units: [{ label: 'tbsp', kcalPer: 102 }, { label: 'tsp', kcalPer: 34 }, { label: 'g', kcalPer: 7.17 }] },

  // Legumes
  { name: 'Lentils (cooked)', category: 'Legumes', units: [{ label: 'cup', kcalPer: 230 }, { label: 'g', kcalPer: 1.16 }] },
  { name: 'Chickpeas (cooked)', category: 'Legumes', units: [{ label: 'cup', kcalPer: 269 }, { label: 'g', kcalPer: 1.64 }] },
  { name: 'Black Beans (cooked)', category: 'Legumes', units: [{ label: 'cup', kcalPer: 227 }, { label: 'g', kcalPer: 1.32 }] },
  { name: 'Kidney Beans (cooked)', category: 'Legumes', units: [{ label: 'cup', kcalPer: 225 }, { label: 'g', kcalPer: 1.27 }] },
  { name: 'Peanuts', category: 'Legumes', units: [{ label: 'handful', kcalPer: 166 }, { label: 'cup', kcalPer: 828 }, { label: 'g', kcalPer: 5.67 }] },

  // Beverages
  { name: 'Black Coffee', category: 'Beverages', units: [{ label: 'cup', kcalPer: 2 }] },
  { name: 'Coffee with Milk', category: 'Beverages', units: [{ label: 'cup', kcalPer: 50 }] },
  { name: 'Latte / White Coffee', category: 'Beverages', units: [{ label: 'cup', kcalPer: 120 }, { label: 'large cup', kcalPer: 190 }] },
  { name: 'Teh Tarik', category: 'Beverages', units: [{ label: 'cup', kcalPer: 130 }] },
  { name: 'Milo', category: 'Beverages', units: [{ label: 'cup', kcalPer: 124 }, { label: 'large cup', kcalPer: 186 }] },
  { name: 'Green Tea', category: 'Beverages', units: [{ label: 'cup', kcalPer: 2 }] },
  { name: 'Orange Juice', category: 'Beverages', units: [{ label: 'glass', kcalPer: 112 }, { label: 'cup', kcalPer: 112 }, { label: 'ml', kcalPer: 0.45 }] },
  { name: 'Coconut Water', category: 'Beverages', units: [{ label: 'glass', kcalPer: 46 }, { label: 'cup', kcalPer: 46 }, { label: 'ml', kcalPer: 0.19 }] },
  { name: 'Milk Tea (bubble)', category: 'Beverages', units: [{ label: 'cup', kcalPer: 250 }, { label: 'large cup', kcalPer: 350 }] },
  { name: 'Cola / Soft Drink', category: 'Beverages', units: [{ label: 'can (330ml)', kcalPer: 140 }, { label: 'glass', kcalPer: 90 }, { label: 'ml', kcalPer: 0.42 }] },
  { name: 'Soy Milk', category: 'Beverages', units: [{ label: 'glass (250ml)', kcalPer: 103 }, { label: 'cup', kcalPer: 103 }, { label: 'ml', kcalPer: 0.41 }] },

  // Snacks & Sweets
  { name: 'Biscuit / Cookie', category: 'Snacks', units: [{ label: 'piece', kcalPer: 45 }, { label: 'g', kcalPer: 4.5 }] },
  { name: 'Chocolate Bar', category: 'Snacks', units: [{ label: 'bar (40g)', kcalPer: 210 }, { label: 'g', kcalPer: 5.35 }] },
  { name: 'Chips / Crisps', category: 'Snacks', units: [{ label: 'small packet', kcalPer: 155 }, { label: 'g', kcalPer: 5.4 }] },
  { name: 'Ice Cream', category: 'Snacks', units: [{ label: 'scoop', kcalPer: 137 }, { label: 'cup', kcalPer: 274 }] },
  { name: 'Cake Slice', category: 'Snacks', units: [{ label: 'slice', kcalPer: 240 }] },
  { name: 'Donut', category: 'Snacks', units: [{ label: 'donut', kcalPer: 253 }] },
  { name: 'Kuih (traditional)', category: 'Snacks', units: [{ label: 'piece', kcalPer: 90 }] },

  // Common Dishes
  { name: 'Fried Rice', category: 'Dishes', units: [{ label: 'plate', kcalPer: 520 }, { label: 'cup', kcalPer: 260 }] },
  { name: 'Nasi Lemak', category: 'Dishes', units: [{ label: 'plate', kcalPer: 644 }, { label: 'pack', kcalPer: 450 }] },
  { name: 'Nasi Goreng', category: 'Dishes', units: [{ label: 'plate', kcalPer: 500 }] },
  { name: 'Mee Goreng', category: 'Dishes', units: [{ label: 'plate', kcalPer: 460 }] },
  { name: 'Roti Canai', category: 'Dishes', units: [{ label: 'piece', kcalPer: 301 }] },
  { name: 'Sandwich', category: 'Dishes', units: [{ label: 'sandwich', kcalPer: 250 }, { label: 'large sandwich', kcalPer: 380 }] },
  { name: 'Burger', category: 'Dishes', units: [{ label: 'burger', kcalPer: 295 }, { label: 'large burger', kcalPer: 490 }] },
  { name: 'Char Kway Teow', category: 'Dishes', units: [{ label: 'plate', kcalPer: 744 }] },
  { name: 'Laksa', category: 'Dishes', units: [{ label: 'bowl', kcalPer: 589 }] },
  { name: 'Curry (with rice)', category: 'Dishes', units: [{ label: 'plate', kcalPer: 450 }] },
  { name: 'Tom Yum Soup', category: 'Dishes', units: [{ label: 'bowl', kcalPer: 90 }] },
  { name: 'Wonton Soup', category: 'Dishes', units: [{ label: 'bowl', kcalPer: 180 }] },
  { name: 'Dim Sum (mixed)', category: 'Dishes', units: [{ label: 'piece', kcalPer: 55 }, { label: 'basket (3 pcs)', kcalPer: 165 }] },
  { name: 'Pizza', category: 'Dishes', units: [{ label: 'slice', kcalPer: 266 }, { label: 'large slice', kcalPer: 350 }] },
  { name: 'French Fries', category: 'Dishes', units: [{ label: 'small serving', kcalPer: 230 }, { label: 'medium serving', kcalPer: 340 }, { label: 'large serving', kcalPer: 490 }] },
]

export function searchFoods(query: string): DefaultFood[] {
  if (!query.trim()) return DEFAULT_FOODS
  const q = query.toLowerCase()
  return DEFAULT_FOODS.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
}
