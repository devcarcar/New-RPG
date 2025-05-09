import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultNavigationBar,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
  SIX_HOURS,
  TEN_MINUTES,
  baits,
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
      [DefaultEmbed("Error!", "You haven't selected your tool yet!")],
      []
    );
  }
  cooldowns.set("fish", {
    ongoing: true,
    expireAt: Date.now() + TEN_MINUTES,
    data: {
      tools: tool,
    },
  });
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: {},
      },
    }
  );
  await users.findOneAndUpdate(
    { userId: interaction.user.id },
    {
      $set: {
        cooldowns: cooldowns,
      },
    }
  );
  await EditMessage(
    interaction.token,
    [
      DefaultEmbed(
        "Fishing",
        `Ready in <t:${Math.floor(Date.now() + TEN_MINUTES / 1000)}:R>`
      ),
    ],
    [DefaultNavigationBar("fish")]
  );
}
