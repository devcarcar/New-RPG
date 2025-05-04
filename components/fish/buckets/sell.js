import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { buckets } = userData.fish;
  let opt = [];
  let msg = "";
  buckets.forEach((recipe) => {
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
