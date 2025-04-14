import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: "You see something",
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: "s",
            label: "Continue",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
  );
}
