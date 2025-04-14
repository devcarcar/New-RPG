import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "toolbox",
    }
  );
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Toolbox",
        description: "Check your toolbox",
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: "fish_next",
            label: "Next",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
  );
}
