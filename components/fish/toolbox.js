import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";
let arr = [
  {
    id: "bait",
    name: "Bait",
    amount: 2,
  },
  {
    id: "frod",
    name: "Fishing Rod",
    amount: 3,
  },
];

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "toolbox",
    }
  );
  let opt = [];
  let v1 = "";
  arr.forEach((tool) => {
    v1 += `${tool.name} - ${tool.amount}\n`;
    opt.push({
      value: tool.id,
      label: tool.name,
      description: "You have: " + tool.amount,
    });
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Toolbox",
        description: "Check your toolbox",
        fields: [
          {
            name: "No Field Name",
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
            custom_id: "fish_toolbox",
            placeholder: "Choose a tool",
            options: opt,
          },
        ],
      },
    ]
  );
}
