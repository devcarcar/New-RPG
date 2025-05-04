import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultStringSelect, EditMessage, seafoodData } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Buckets",
        description: "Select a buckets option",
      },
    ],
    [
      DefaultStringSelect("fish/buckets/@", "Select a buckets option", [
        {
          value: "cook",
          label: "Cook",
          description: "Cooking",
        },
        {
          value: "sell",
          label: "Sell",
          description: "Selling",
        },
        {
          value: "view",
          label: "View",
          description: "View your buckets",
        },
        {
          value: "@fish",
          label: "Back",
          description: "Go back",
        },
      ]),
    ]
  );
}
