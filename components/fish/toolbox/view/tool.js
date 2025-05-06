import { sessions } from "../../../../schemas/session.js";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
} from "../../../../utils.js";
export async function execute(interaction, data) {
  const { userData, sessionData } = data;
  const { toolbox } = userData.fish;
  const found = toolbox.find((tool) => tool.id === interaction.value);
  await sessions.findOneAndUpdate(
    { sessionId: sessionData.sessionId },
    {
      $set: {
        data: {
          tool: found,
        },
      },
    }
  );
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed("Fishing Toolbox", "Select a tool option")],
    [
      DefaultStringSelect("fish/toolbox/view/tool/@", "Select a tool option", [
        {
          value: "repair",
          label: "Repair",
          description: "Repair your tool",
        },
      ]),
    ]
  );
}
