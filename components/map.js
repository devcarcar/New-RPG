import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, ItemTypes, islands } from "../utils.js";
import { sessions } from "../schemas/session.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        token: interaction.token,
      },
    }
  );
  let str = "";
  let opt = [];
  islands.forEach((l) => {
    if (l.id === userData.location) str += `${l.name} - You are here!\n`;
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
