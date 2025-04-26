import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../utils.js";
const locations = [
  {
    id: "starter_island",
    name: "Starter Island",
    description: "The island where everything started",
    reqLevel: 0,
  },
  {
    id: "sunset_sands",
    name: "Sunset Sands",
    description: "better ig",
    reqLevel: 10,
  },
];

export async function execute(interaction, data) {
  let str = "";
  let opt = [];
  const cL = "starter_island";
  locations.forEach((l) => {
    if (l.id === cL) str += `${l.name} - You are here!\n`;
    else str += `${l.name} - Unlocked at Level ${l.reqLevel}\n`;
    opt.push({
      label: l.name,
      description: l.description,
      value: l.id,
    });
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Map",
        description: str,
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
            custom_id: "map/location",
            placeholder: "Select a location",
            options: opt,
          },
        ],
      },
    ]
  );
}
