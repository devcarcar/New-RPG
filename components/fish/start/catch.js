import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { tool } = sessionData.data;
  const { cooldowns } = userData;

  if (!tool) {
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

  if (tool.type === FishingToolTypes.TRAP) {
    const time = Date.now() + Math.floor(Math.random() * 6 * 60 * 60 * 1000);
    cooldowns.set("fish", {
      ongoing: true,
      time: time,
      tool: tool,
    });
    await EditMessage(
      interaction.token,
      [
        DefaultEmbed(
          "Fishing",
          `You cast a ${tool.name}. Ready in <t:${Math.floor(time / 1000)}:R>`
        ),
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

  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $set: {
        cooldowns: cooldowns,
      },
    }
  );
}
