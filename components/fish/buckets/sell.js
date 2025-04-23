import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
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
    [
      {
        title: "Selling",
        description: msg,
      },
    ],
    [DefaultStringSelect("fish/buckets/sell/?", opt)]
  );
}
