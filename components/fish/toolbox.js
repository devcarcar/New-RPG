import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";
let ToolBoxType = {
  BAIT: 0,
  TOOL: 1,
};
let arr = [
  {
    id: "lucky_bait",
    name: "Lucky Bait",
    amount: 2,
    type: ToolBoxType.BAIT,
  },
  {
    id: "fishing_rod",
    name: "Fishing Rod",
    amount: 3,
    type: ToolBoxType.TOOL,
  },
  {
    id: "lobster_trap",
    name: "Lobster Trap",
    amount: 1,
    type: ToolBoxType.TOOL,
  },
  {
    id: "fishing_net",
    name: "Fishing Net",
    amount: 1,
    type: ToolBoxType.TOOL,
  },
];

export async function execute(interaction, data) {
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
            custom_id: "fish/toolbox",
            placeholder: "Choose a tool",
            options: opt,
          },
        ],
      },
    ]
  );
}
