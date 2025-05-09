import {
  DefaultEmbed,
  DefaultNavigationBar,
  EditMessage,
} from "../../utils.js";
import { sessions } from "../../schemas/session.js";
import { users } from "../../schemas/user.js";
import { COMPONENTS } from "../../builders/components.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { cooldowns, inventory, fish } = userData;
  const found = cooldowns.get("fish") ?? { ongoing: false };
  if (!found) {
    cooldowns.set("fish", { ongoing: false });
    await users.findOneAndUpdate(
      { userId: userData.userId },
      { $set: { cooldowns: cooldowns } }
    );
  }
  if (found.ongoing) {
    if (found.expireAt > Date.now()) {
      return EditMessage(
        interaction.token,
        [
          DefaultEmbed(
            "Fishing",
            `Ready in <t:${Math.floor(found.expireAt / 1000)}:R>`
          ),
        ],
        [DefaultNavigationBar("fish")]
      );
    }
    cooldowns.set("fish", { ongoing: false });
    await users.findOneAndUpdate(
      { userId: userData.userId },
      { $set: { cooldowns } }
    );

    return EditMessage(
      interaction.token,
      [DefaultEmbed("Fishing", `You caught:\n${currentBuckets}`)],
      [DefaultNavigationBar("fish")]
    );
  } else {
    const { toolbox } = userData.fish;
    let opt = [];
    toolbox.forEach((tool) =>
      opt.push({
        label: tool.name,
        value: tool.id,
        description: tool.description,
      })
    );
    await sessions.findOneAndUpdate(
      { sessionId: sessionData.sessionId },
      { $set: { data: { tools: [] } } }
    );
    return await EditMessage(
      interaction.token,
      [DefaultEmbed("Fishing", "Select your tools")],
      COMPONENTS.TOOL_AND_BAIT(opt)
    );
  }
}
