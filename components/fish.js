import { MessageComponentTypes } from "discord-interactions";
import { DefaultStringSelect, EditMessage } from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing",
        description: "Select a fishing option",
      },
    ],
    [
      DefaultStringSelect("fish/@", [
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
