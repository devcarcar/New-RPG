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
    switch (found.tool.type) {
      case FishingToolTypes.TRAP:
        if (found.time > Date.now()) {
          //not expired
        } else {
          //expired

          const caught = randomElement(found.tool.catches);
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
        break;
    }
  }
  let opt = [];
  tools.forEach((tool) =>
    opt.push({
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
      DefaultStringSelect("fish/start/tool", opt),
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
