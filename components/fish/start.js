import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "/start",
    }
  );
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: "Started",
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: "fish/next",
            label: "Next",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
  );
}
