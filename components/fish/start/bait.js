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
  let opt1 = [];
  let opt2 = [];
  baits.forEach((bait) =>
    opt1.push({
      label: bait.name,
      value: bait.id,
      description: bait.description,
    })
  );
  tools.forEach((tool) =>
    opt2.push({
      label: tool.name,
      value: tool.id,
      description: tool.description,
    })
  );
  const { sessionData } = data;
  const found = baits.find((bait) => bait.id === interaction.value);
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
        description: `Tool: ${tool?.name ?? "No Tool"}\nBait: ${bait.name}`,
      },
    ],
    [
      DefaultStringSelect("fish/start/bait", opt1),
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
