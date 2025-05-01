import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Hunting",
        description: "Select a hunting option",
      },
    ],
    [
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            custom_id: "hunt/start",
            label: "Start",
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
  );
}
