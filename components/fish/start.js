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
          DefaultStringSelect("@", "Select an option", [
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
      const lbs =
        Math.random() * caught.lowest + (caught.highest - caught.lowest);
      await users.findOneAndUpdate(
        {
          userId: userData.userId,
        },
        {
          $push: {
            buckets: {
              id: caught.id,
              name: caught.name,
              weight: lbs,
            },
          },
        }
      );
      return await EditMessage(
        interaction.token,
        [DefaultEmbed("Fishing", `You caught a ${lbs} lbs ${caught.name}! `)],
        [
          DefaultStringSelect("@", "Back bar", [
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
        DefaultStringSelect("fish/start/tool", "Select a tool", opt1),
        DefaultStringSelect("fish/start/bait", "Select a bait", opt2),
        DefaultStringSelect("@", "Confirmation", [
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
