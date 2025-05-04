import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultStringSelect, EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { toolbox } = userData.fish;
  let opt = [];
  let v1 = "";
  toolbox.forEach((tool) => {
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
    [DefaultStringSelect("fish/toolbox", "Select a tool", opt)]
  );
}
