import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultNavigationBar,
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
  const { tool } = sessionData.data;
  const { cooldowns } = userData;

  if (!tool) {
    return await CreateFollowUpMessage(
      interaction.token,
      [DefaultEmbed("Error!", "You haven't selected your tool yet!")],
      []
    );
  }

  const expireAt = Date.now() + Math.floor(Math.random() * 10 * 60 * 1000);
  cooldowns.set("fish", {
    ongoing: true,
    expireAt: Date.now() + 6 * 60 * 60 * 1000,
    data: {
      tool: tool,
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
    [DefaultEmbed("Fishing", `Ready in <t:${Math.floor(expireAt / 1000)}:R>`)],
    [DefaultNavigationBar("fish")]
  );
}
