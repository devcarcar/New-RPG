import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultButton,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  baits,
  tools,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

import { COMPONENTS } from "../../../builders/components.js";

export async function execute(interaction, data) {
  let opt1 = [];
  let opt2 = [];
  tools.forEach((tool) =>
    opt1.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  baits.forEach((tool) =>
    opt2.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  const { sessionData } = data;
  const found = tools.find((tool) => tool.id === interaction.value);
  sessionData.data.tool = found;
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
      DefaultEmbed(
        "Fishing",
        `Tool: ${tool.name}\nBait: ${bait?.name ?? "No bait selected"}`
      ),
    ],
    COMPONENTS.TOOL_AND_BAIT(opt1, opt2)
  );
}
