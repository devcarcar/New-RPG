import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

const recipes = [
  {
    id: "grilled_lobster",
    name: "Grilled Lobster",
    description: "Succulent lobster basted in garlic butter. A coastal luxury.",
    rarity: "uncommon",
    ingredients: [
      { id: "lobster", amount: 1 }, // 1x Lobster
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
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "/buckets/item",
    }
  );
  let opt = [];
  recipes.forEach((recipe) =>
    opt.push({
      label: recipe.name,
      value: recipe.id,
      description: recipe.description,
    })
  );
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Recipes",
        description: "Check the recipes",
      },
    ],
    [DefaultStringSelect("fish/buckets/cook/recipe", "Select a recipe", opt)]
  );
}
