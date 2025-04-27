import { MessageComponentTypes } from "discord-interactions";
import { EditMessage, islands } from "../../utils.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
} from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const found = islands.find((l) => interaction.value === l.id);
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: {
          destination: found,
        },
      },
    }
  );
  let opt =
    userData.location === found.id
      ? []
      : [
          DefaultStringSelect("map/location/@", [
            {
              value: "go",
              label: "Go there",
              description: "Go Go Go",
            },
          ]),
        ];
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed(found.name, found.description)],
    opt
  );
}
