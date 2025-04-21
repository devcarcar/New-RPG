import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes } from "../utils";
const locations = [
  {
    id: "starterisland",
    name: "Starter Island",
    description: "Island",
    reqLevel: 0,
    here: false,
  },
  {
    id: "secondisland",
    name: "Second Island",
    description: "better ig",
    reqLevel: 10,
    here: true,
  },
];

export async function execute(interaction, data) {
  let str = "";
  let opt = [];
  locations.forEach((l) => {
    if (l.here) str += `${l.name} - You are here!\n`;
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
            custom_id: "map/bar",
            placeholder: "Select a location",
            options: opt,
          },
        ],
      },
    ]
  );
}
