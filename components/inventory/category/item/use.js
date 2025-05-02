import { MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  ItemTypes,
} from "../../../../utils.js";
import { sessions } from "../../../../schemas/session.js";

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
    [
      DefaultEmbed(
        "Use Item",
        `Are you sure you want to use ${selected.name}?`
      ),
    ],
    [
      DefaultStringSelect("inventory/category/item/use/@", "Confirm", [
        {
          value: "confirm",
          label: "Confirm",
          description: "Confirm Use",
        },
      ]),
    ]
  );
}
