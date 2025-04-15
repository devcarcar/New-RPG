import { MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../utils.js";
const ItemTypes = {
  FRUIT: 0,
};
const arr = [
  {
    id: "pineapple",
    name: "Pineapple",
    description: "Super pineapple",
    amount: 1,
    type: ItemTypes.FRUIT,
  },
  {
    id: "coconut",
    name: "Coconut",
    description: "A",
    amount: 2,
    type: ItemTypes.FRUIT,
  },
];

export async function execute(interaction, data) {
  let str = "";
  let opt = [];
  arr.forEach((item) => {
    str += `${item.name} - ${item.amount}\n`;
    opt.push({
      value: item.id,
      label: item.name,
      description: `${item.description}`,
    });
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Inventory",
        description: "Inventory system",
        fields: [
          {
            name: "\u200b",
            value: str,
          },
        ],
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
            custom_id: "inventory_bar",
            placeholder: "Choose a fishing sub-feature",
            options: opt,
          },
        ],
      },
    ]
  );
}
