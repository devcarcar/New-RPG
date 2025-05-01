import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultButton,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  FishingToolTypes,
  baits,
  randomElement,
  seafoodData,
  tools,
} from "../../utils.js";
import { sessions } from "../../schemas/session.js";
import { users } from "../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { cooldowns, inventory } = userData;
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
        [
          DefaultStringSelect("@", [
            { label: "Back", value: "fish", description: "Go back" },
          ]),
        ]
      );
    } else {
      const caught = randomElement(found.data.tool.catches);
      cooldowns.set("fish", { ongoing: false });
      await users.findOneAndUpdate(
        { userId: userData.userId },
        {
          $set: {
            cooldowns: cooldowns,
          },
        }
      );
      return await EditMessage(
        interaction.token,
        [DefaultEmbed(`You caught a ${caught.name}`, "F")],
        [
          DefaultStringSelect("@", [
            {
              label: "Back",
              value: "fish",
              description: "Go back",
            },
          ]),
        ]
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
      [
        {
          title: "Fishing",
          description: "Tool: No tool selected\nBait: No bait selected",
        },
      ],
      [
        DefaultStringSelect("fish/start/tool", opt1),
        DefaultStringSelect("fish/start/bait", opt2),
        DefaultStringSelect("@", [
          {
            label: "Catch",
            value: "fish/start/catch",
            description: "Catch",
          },
          {
            label: "Back",
            value: "fish",
            description: "Go back",
          },
        ]),
      ]
    );
  }
}
