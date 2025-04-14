import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../utils.js";
import { sessions } from "../../schemas/session.js";

export async function execute(interaction, data) {
  await sessions.findOneAndUpdate(
    {
      sessionId: data.sessionData.sessionId,
    },
    {
      state: "buckets",
    }
  );
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Buckets",
        description: "Check your buckets",
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
