import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultStringSelect,
  EditMessage,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { tool, bait } = sessionData.data;
  const { cooldowns } = userData;

  if (!tool || !bait) {
    return await CreateFollowUpMessage(
      interaction.token,
      [
        {
          title: "Error!",
          description: "You haven't selected your tool or/and your bait yet!",
        },
      ],
      []
    );
  }
  const time = Date.now() + Math.floor(Math.random() * 10 * 60 * 1000);
  cooldowns.set("fish", {
    ongoing: true,
    time: time,
    data: {
      bait: bait,
      tool: tool,
    },
  });
  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $set: {
        cooldowns: cooldowns,
      },
    }
  );
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: `You are fishing with ${tool.name} and ${
          bait.name
        }. Ready in <t:${Math.floor(time / 1000)}:R>`,
      },
    ],
    [
      DefaultStringSelect("@", [
        {
          value: "fish",
          label: "Back",
          description: "Go back",
        },
      ]),
    ]
  );
}
