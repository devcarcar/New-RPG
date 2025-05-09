import { MessageComponentTypes } from "discord-interactions";
import { sessions } from "../../../schemas/session.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  EditMessage,
  ItemTypes,
} from "../../../utils.js";

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
      state: "/category/item",
    }
  );
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed("Item", selected.description)],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.STRING_SELECT,
            min_value: 1,
            max_value: 1,
            custom_id: "inventory/category/item/@",
            placeholder: "Choose an action",
            options: [
              {
                value: "use",
                label: "Use",
                description: "Use item",
              },
              {
                value: "sell",
                label: "Sell",
                description: "Sell item",
              },
            ],
          },
        ],
      },
    ]
  );
}
