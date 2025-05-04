import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

export async function execute(interaction, data) {
  let opt = [];
  let msg = "";
  seafoodData.forEach((recipe) => {
    msg += `${recipe.name} - ${recipe.weight} ${recipe.unit}\n`;
    opt.push({
      label: recipe.name,
      value: recipe.id,
      description: `${recipe.weight} ${recipe.unit}`,
    });
  });
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Selling", msg)],
    [DefaultStringSelect("fish/buckets/sell/?", "sell", opt)]
  );
}
