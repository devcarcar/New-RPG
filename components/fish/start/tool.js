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

export async function execute(interaction, data) {
  let opt2 = [];
  tools.forEach((tool) =>
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
  const { tool } = updated.data;
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: `Tool: ${tool.name}`,
      },
    ],
    [
      DefaultStringSelect("fish/start/tool", opt2),
      DefaultStringSelect("@", [
        {
          label: "Catch",
          value: "fish/start/catch",
          description: "Catch",
        },
        {
          label: "Back",
          value: "fish",
          description: "Go back",
        },
      ]),
    ]
  );
}
