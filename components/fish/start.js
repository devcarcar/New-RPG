import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultButton,
  DefaultEmbed,
  DefaultNavigationBar,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
  baits,
  randomElement,
  tools,
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
    if (found.time > Date.now()) {
      return await EditMessage(
        interaction.token,
        [
          DefaultEmbed(
            "Fishing",
            `Ready in <t:${Math.floor(found.time / 1000)}:R>`
          ),
        ],
        [DefaultNavigationBar("fish")]
      );
    } else {
      const caught = randomElement(found.data.tool.catches);
      cooldowns.set("fish", { ongoing: false });
      const lbs =
        caught.lowest + Math.random() * (caught.highest - caught.lowest);
      fish.buckets.push({
        id: caught.id,
        name: caught.name,
        weight: lbs,
      });
      await users.findOneAndUpdate(
        {
          userId: userData.userId,
        },
        {
          $set: {
            cooldowns: cooldowns,
            fish: fish,
          },
        }
      );
      return await EditMessage(
        interaction.token,
        [DefaultEmbed("Fishing", `You caught a ${lbs} lbs ${caught.name}! `)],
        [DefaultNavigationBar("fish")]
      );
    }
  } else {
    let opt1 = [];
    tools.forEach((tool) =>
      opt1.push({
        label: tool.name,
        value: tool.id,
        description: tool.description,
      })
    );
    let opt2 = [];
    baits.forEach((bait) =>
      opt2.push({
        label: bait.name,
        value: bait.id,
        description: bait.description,
      })
    );
    return await EditMessage(
      interaction.token,
      [DefaultEmbed("Fishing", "Select your tool and bait")],
      COMPONENTS.TOOL_AND_BAIT(opt1, opt2)
    );
  }
}
