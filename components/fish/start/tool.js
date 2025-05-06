import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, EditMessage } from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { COMPONENTS } from "../../../builders/components.js";

export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { toolbox } = userData.fish;
  const { tools } = sessionData.data;
  let str = "";
  let opt = [];
  toolbox.forEach((tool) =>
    opt.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  const found = toolbox.find((tool) => tool.id === interaction.value);
  if (tools.some((tool) => tool.id === found.id))
    sessionData.data.tools.pop(found);
  else sessionData.data.tools.push(found);
  const updated = await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: sessionData.data,
      },
    },
    {
      new: true,
    }
  );
  updated.data.tools.forEach(
    (tool) =>
      (str += `${tool.name} - ${tool.durability}/${tool.max_durability} Durability\n`)
  );
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing", `Tools:\n ${str}`)],
    COMPONENTS.TOOL_AND_BAIT(opt)
  );
}
