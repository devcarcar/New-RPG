import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";
let arr = [
  {
    id: "cod",
    name: "Cod",
    weight: 4.59,
  },
];

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "buckets",
    }
  );
  let v1 = "";
  let opt = [];
  arr.forEach((fish) => {
    v1 += `${fish.name} - ${fish.weight}\n`;
    opt.push({
      value: fish.id,
      label: fish.name,
      description: "Weight: " + fish.weight + " lbs",
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
            custom_id: "fish_buckets",
            placeholder: "Choose a fishing sub-feature",
            options: opt,
          },
        ],
      },
    ]
  );
}
