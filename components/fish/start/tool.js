import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, EditMessage } from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { COMPONENTS } from "../../../builders/components.js";

export async function execute(interaction, data) {
  const { sessionData } = data;
  const { toolbox } = sessionData.fish;
  let opt = [];
  toolbox.forEach((tool) =>
    opt.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  const found = toolbox.find((tool) => tool.id === interaction.value);
  sessionData.data.tool = found;
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: sessionData.data,
      },
    }
  );
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing", `Tool: ${found.name}`)],
    COMPONENTS.TOOL_AND_BAIT(opt)
  );
}
