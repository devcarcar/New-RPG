import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultButton,
  DefaultStringSelect,
  EditMessage,
  baits,
  tools,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";
import { EMBEDS } from "../../../embeds/embed.js";
import { COMPONENTS } from "../../../builders/components.js";

export async function execute(interaction, data) {
  let opt1 = [];
  tools.forEach((tool) =>
    opt1.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  let opt2 = [];
  baits.forEach((tool) =>
    opt2.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  const { sessionData } = data;
  const found = baits.find((tool) => tool.id === interaction.value);
  sessionData.data.bait = found;
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
  const { tool, bait } = updated.data;
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: `Tool: ${tool?.name ?? "No tool selected"}\nBait: ${
          bait.name
        }`,
      },
    ],
    COMPONENTS.TOOL_AND_BAIT(opt1, opt2)
  );
}
