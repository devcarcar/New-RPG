import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultStringSelect, EditMessage, seafoodData } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  let v1 = "";
  let opt = [];
  seafoodData.forEach((seafood) => {
    v1 += `${seafood.name} - ${seafood.weight} ${seafood.unit}\n`;
    opt.push({
      value: seafood.id,
      label: seafood.name,
      description: `Weight: ${seafood.weight} ${seafood.unit}`,
    });
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Buckets",
        description: "Your fishing buckets:",
        fields: [
          {
            name: "No field name",
            value: v1,
            inline: true,
          },
        ],
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
          label: "Info",
          value: "fish/buckets/info",
          description: "Info",
        },
        {
          label: "Back",
          value: "fish",
          description: "Info",
        },
      ]),
    ]
  );
}
