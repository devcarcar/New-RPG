import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultButton,
  DefaultStringSelect,
  EditMessage,
  baits,
  tools,
} from "../../utils.js";
import { sessions } from "../../schemas/session.js";
import { users } from "../../schemas/user.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { tool, bait } = sessionData.data;
  const { cooldowns } = userData;
  const found = cooldowns.get("fish") ?? { ongoing: false };
  if (!found) {
    cooldowns.set("fish", { ongoing: false });
    await users.findOneAndUpdate(
      { userId: userData.userId },
      { $set: { cooldowns: cooldowns } }
    );
  }
  if (found.ongoing) {
    if (found.time < Date.now()) {
      cooldowns.set("fish", {
        ongoing: false,
      });
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
        [
          {
            title: "You caught a fish!",
            description: `Its a lobster!`,
          },
        ],
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
    } else {
      return await EditMessage(
        interaction.token,
        [
          {
            title: "You have already casted your line!",
            description: `Ready in <t:${Math.floor(found.time / 1000)}:R>`,
          },
        ],
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
  }
  let opt1 = [];
  let opt2 = [];
  baits.forEach((bait) =>
    opt1.push({
      label: bait.name,
      value: bait.id,
      description: bait.description,
    })
  );
  tools.forEach((tool) =>
    opt2.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );

  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: "Choose your tools?",
      },
    ],
    [
      DefaultStringSelect("fish/start/bait", opt1),
      DefaultStringSelect("fish/start/tool", opt2),
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
