import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
  baits,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";
import {
  CreateGrid,
  CreateGridButtons,
  CreateGridData,
} from "../../../test.js";

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
      tool: tool,
      bait: bait,
    },
  });
  await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing", `Ready in <t:${Math.floor(time / 1000)}:R>`)],
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

  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $set: {
        cooldowns: cooldowns,
      },
    }
  );
}
