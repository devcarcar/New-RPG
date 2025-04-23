import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage, seafoodData } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "/buckets",
    }
  );
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
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.STRING_SELECT,
            min_value: 1,
            max_value: 1,
            custom_id: "fish/buckets/@",
            placeholder: "Choose a bucket sub-feature",
            options: [
              {
                label: "Cook",
                value: "cook",
                description: "Cooking",
              },
              {
                label: "Sell",
                value: "sell",
                description: "Selling",
              },
              {
                label: "Info",
                value: "info",
                description: "Info",
              },
            ],
          },
        ],
      },
    ]
  );
}
