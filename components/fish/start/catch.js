import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultNavigationBar,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
  SIX_HOURS,
  baits,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { users } from "../../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { tools } = sessionData.data;
  const { cooldowns } = userData;

  if (tools.length < 1) {
    return await CreateFollowUpMessage(
      interaction.token,
      [DefaultEmbed("Error!", "You haven't selected your tool yet!")],
      []
    );
  }
  let loot = [];
  for (let i = 0; i < 18; i++) {
    let random = Math.random();
    if (random > 0.5) loot.push("lobster");
    else loot.push("fish");
  }
  cooldowns.set("fish", {
    ongoing: true,
    expireAt: Date.now() + SIX_HOURS,
    data: {
      tools: tools,
      loot: loot,
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
        `Ready in <t:${Math.floor((Date.now() + SIX_HOURS) / 1000)}:R>`
      ),
    ],
    [DefaultNavigationBar("fish")]
  );
}
