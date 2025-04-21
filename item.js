const ItemType = {
  SEAFOOD: 0,
  FRUIT: 1,
};
const ItemRarity = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};
const itemList = [
  // === SEAFOOD === //
  {
    id: "lobster",
    name: "Lobster",
    description:
      "A vibrant tropical lobster with sweet, firm meat. Highly prized by chefs.",
    type: ItemType.SEAFOOD,
    rarity: ItemRarity.RARE,
  },
  {
    id: "crab",
    name: "Crab",
    description:
      "A massive land crab known for cracking coconuts with its claws. Delicacy.",
    type: ItemType.SEAFOOD,
    rarity: ItemRarity.RARE,
  },
  {
    id: "scallop",
    name: "Scallop",
    description:
      "Rare bioluminescent scallop found in shallow reefs. Glows at night.",
    type: ItemType.SEAFOOD,
    rarity: ItemRarity.UNCOMMON,
  },

  // === FRUITS === //
  {
    id: "pineapple",
    name: "Pineapple",
    description:
      "Extra-sweet variety grown in volcanic soil. Symbol of hospitality.",
    type: ItemType.FRUIT,
    rarity: ItemRarity.RARE,
  },
  {
    id: "coconut",
    name: "Coconut",
    description:
      "Ancient palm variety with creamy, nutrient-rich water. Heals fatigue.",
    type: ItemType.FRUIT,
    rarity: ItemRarity.UNCOMMON,
  },
  {
    id: "mango",
    name: "Mango",
    description:
      "Fiery red-fleshed mango with a spicy aftertaste. Only grows near active volcanoes.",
    type: ItemType.FRUIT,
    rarity: ItemRarity.COMMON,
  },
];
