import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultStringSelect, EditMessage, seafoodData } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Buckets",
        description: "Select an action below",
      },
    ],
    [
      DefaultStringSelect("@", [
        {
          label: "Cook",
          value: "fish/buckets/cook",
          description: "Cooking",
        },
        {
          label: "Sell",
          value: "fish/buckets/sell",
          description: "Selling",
        },
        {
          label: "View",
          value: "fish/buckets/view",
          description: "View your buckets",
        },
        {
          label: "Back",
          value: "fish",
          description: "bak",
        },
      ]),
    ]
  );
}
