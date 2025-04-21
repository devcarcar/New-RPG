import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Inventory",
        description: "Select a category",
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.STRING_SELECT,
            min_value: 1,
            max_value: 1,
            custom_id: "inventory/category",
            placeholder: "Choose a category",
            options: [
              {
                label: "Fruit",
                value: ItemTypes.FRUIT,
                description: "Fruit",
              },
            ],
          },
        ],
      },
    ]
  );
}
