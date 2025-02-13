var locations = [
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
var buildings = [
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
var ItemType;
(function (ItemType) {
    ItemType[ItemType["SEAFOODS"] = 0] = "SEAFOODS";
    ItemType[ItemType["ANIMAL_PRODUCTS"] = 1] = "ANIMAL_PRODUCTS";
    ItemType[ItemType["FOOD_INGREDIENTS"] = 2] = "FOOD_INGREDIENTS";
    ItemType[ItemType["ORES"] = 3] = "ORES";
    ItemType[ItemType["RAW_MATERIALS"] = 4] = "RAW_MATERIALS";
    ItemType[ItemType["EQUIPMENTS"] = 5] = "EQUIPMENTS";
    ItemType[ItemType["TOOLS"] = 6] = "TOOLS";
    ItemType[ItemType["POTION_INGREDIENTS"] = 7] = "POTION_INGREDIENTS";
    ItemType[ItemType["POTIONS"] = 8] = "POTIONS";
    ItemType[ItemType["ARTIFACTS"] = 9] = "ARTIFACTS";
    ItemType[ItemType["SPECIAL"] = 10] = "SPECIAL";
    ItemType[ItemType["CHEST_KEY"] = 11] = "CHEST_KEY";
    ItemType[ItemType["CHEST"] = 12] = "CHEST";
    ItemType[ItemType["EVENT"] = 13] = "EVENT";
    ItemType[ItemType["DROPS"] = 14] = "DROPS";
})(ItemType || (ItemType = {}));
