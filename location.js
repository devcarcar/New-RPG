const locations = [
  {
    name: "Village",
    gather: [
      {
        name: "Apple Tree Grove",
        time: 5,
        chance: 0.6,
        drop: "Apple",
      },
      {
        name: "Chicken Coop",
        time: 20,
        chance: 0.6,
        drop: "Egg",
      },
      {
        name: "Abondoned Fishing Hut",
        time: 8,
        chance: 0.6,
        drop: "Cod",
      },
      {
        name: "Iron Mine",
        time: 30,
        chance: 0.4,
        drop: "Iron",
      },
      {
        name: "Wheat Field",
        time: 10,
        chance: 0.8,
        drop: "Wheat",
      },
    ],
  },
];

const buildings = [
  {
    name: "Bakery",
    levels: [
      {
        name: "Bread",
        recipe: [{ name: "Wheat", value: 3 }],
      },
    ],
  },
  {
    name: "Diary",
    levels: [
      {
        name: "Cream",
        recipe: [{ name: "Milk", value: 1 }],
      },
      {
        name: "Butter",
        recipe: [{ name: "Milk", value: 2 }],
      },
      {
        name: "Cheese",
        recipe: [{ name: "Milk", value: 3 }],
      },
      {
        name: "Yougurt",
        recipe: [
          { name: "Milk", value: 2 },
          {
            name: "Cream",
            value: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Blacksmith",
    levels: [
      {
        name: "Iron Sword",
        recipe: [
          {
            name: "Iron Ingot",
            value: 2,
          },
          {
            name: "Stick",
            value: 1,
          },
        ],
      },
    ],
  },
];

let ItemType = {
  SEAFOODS,
  ANIMAL_PRODUCTS,
  FOOD_INGREDIENTS,
  ORES,
  RAW_MATERIALS,
  EQUIPMENTS,
  TOOLS,
  POTION_INGREDIENTS,
  POTIONS,
  ARTIFACTS,
  SPECIAL,
  CHEST_KEY,
  CHEST,
  EVENT,
  DROPS,
};
