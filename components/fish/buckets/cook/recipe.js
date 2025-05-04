import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultButton,
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../../utils.js";
import { sessions } from "../../../../schemas/session.js";
const recipes = [
  {
    id: "grilled_lobster",
    name: "Grilled Lobster",
    description: "Succulent lobster basted in garlic butter. A coastal luxury.",
    rarity: "uncommon",
    ingredients: [
      { id: "lobster", amount: 1, requirement: 0.6 }, // 1x Lobster
      { id: "butter", amount: 1 }, // 1x Butter (assumed to be in your item DB)
    ],
  },
  {
    id: "fish_and_chips",
    name: "Fish and Chips",
    description: "Cod with french fries.",
    ingredients: [
      { id: "cod", amount: 1, requirement: 0.1 },
      { id: "potato", amount: 2 },
    ],
  },
];
export async function execute(interaction, data) {
  const found = recipes.find((recipe) => interaction.value === recipe.id);
  let ilist = "";
  found.ingredients.forEach((ing) => {
    ilist += `${ing.id} - ${ing.amount}`;
    if (ing.requirement != undefined) {
      ilist += `Lowest requirement: ${ing.requirement}`;
    }
    ilist += "\n";
  });
  return await CreateFollowUpMessage(
    interaction.token,
    [
      {
        title: found.name,
        description: `Ingredients:\n${ilist}`,
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: "buckets/cook/recipe/confirm",
            label: "Cook",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
  );
}
