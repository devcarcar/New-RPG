import { MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  islands,
} from "../../../utils.js";
import { users } from "../../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { destination } = sessionData.data;
  let str = "";
  let opt = [];
  const cL = destination.id;
  islands.forEach((l) => {
    if (l.id === cL) str += `${l.name} - You are here!\n`;
    else str += `${l.name} - Unlocked at Level ${l.reqLevel}\n`;
    opt.push({
      label: l.name,
      description: l.description,
      value: l.id,
    });
  });
  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    { $set: { location: destination.id } }
  );
  EditMessage(
    sessionData.token,
    [DefaultEmbed("Map", str)],
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
  return await CreateFollowUpMessage(
    interaction.token,
    [
      DefaultEmbed(
        "Success!",
        `You have successfully travelled to ${destination.name}`
      ),
    ],
    []
  );
}
