import { MessageComponentTypes } from "discord-interactions";
import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  ItemTypes,
} from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Inventory", "Select an inventory category")],
    [
      DefaultStringSelect("inventory/category", "Select a category", [
        {
          label: "Fruit",
          value: ItemTypes.FRUIT,
          description: "Fruit",
        },
      ]),
    ]
  );
}
