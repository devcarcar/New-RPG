import { MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, DefaultStringSelect, EditMessage } from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Fishing", "Select a fishing option")],
    [
      DefaultStringSelect("fish/@", "Select a fishing option", [
        {
          value: `buckets`,
          label: "Buckets",
          description: "aa",
        },
        {
          value: `toolbox`,
          label: "Toolbox",
          description: "aa",
        },
        {
          value: `start`,
          label: "Start",
          description: "aaa",
        },
      ]),
    ]
  );
}
