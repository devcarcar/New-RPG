import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../../utils.js";

const selected = {
  id: "pineapple",
  name: "Pineapple",
  description: "Pined apple",
  type: ItemTypes.FRUIT,
};

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "category/item",
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
            custom_id: "inventory_bar",
            placeholder: "Choose a category",
            options: opt,
          },
        ],
      },
    ]
  );
}
