import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

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
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "/category",
    }
  );
  let str = "";
  let opt = [];
  arr.forEach((item) => {
    if (item.type === ItemTypes.FRUIT) {
      str += `${item.name} - ${item.amount}\n`;
      opt.push({
        value: item.id,
        label: item.name,
        description: `${item.description}`,
      });
    }
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Inventory",
        //       description: "Inventory system",
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
            custom_id: "inventory/category/item",
            placeholder: "Choose an item",
            options: opt,
          },
        ],
      },
    ]
  );
}
