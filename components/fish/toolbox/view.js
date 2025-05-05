import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
} from "../../../utils.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { toolbox } = userData.fish;
  let opt = [];
  let str = "";
  toolbox.forEach((tool) => {
    opt.push({
      value: tool.id,
      label: tool.name,
      description: tool.durability + "/" + tool.max_durability,
    });
    str += `${tool.name} - ${tool.durability}/${tool.max_durability} Durability`;
  });
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing Toolbox", str)],
    [
      DefaultStringSelect(
        "fish/toolbox/view/tool",
        "Select a tool to view",
        opt
      ),
    ]
  );
}
