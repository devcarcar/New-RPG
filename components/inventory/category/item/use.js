import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { CreateFollowUpMessage, DefaultEmbed } from "../../../utils.js";

const selected = {
  id: "pineapple",
  name: "Pineapple",
  description: "Pined apple",
  type: ItemTypes.FRUIT,
  amount: 3,
};

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "category/item/use",
    }
  );
  // use logic
  return await CreateFollowUpMessage(
    interaction.token,
    [
      DefaultEmbed(
        `You used ${selected.name}`,
        `You have ${selected.amount--} left.`
      ),
    ],
    []
  );
}
