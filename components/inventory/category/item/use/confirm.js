import { MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  ItemTypes,
} from "../../../../../utils.js";
import { sessions } from "../../../../../schemas/session.js";

const selected = {
  id: "pineapple",
  name: "Pineapple",
  description: "Pined apple",
  type: ItemTypes.FRUIT,
  amount: 3,
};

export async function execute(interaction, data) {
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed("Use Item", `You successfully used ${selected.name}`)],
    []
  );
}
