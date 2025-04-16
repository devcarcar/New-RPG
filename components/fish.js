import { MessageComponentTypes } from "discord-interactions";
import { EditMessage } from "../utils.js";

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
      {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
          {
            type: MessageComponentTypes.STRING_SELECT,
            min_value: 1,
            max_value: 1,
            custom_id: "fish_@bar",
            placeholder: "Choose a fishing sub-feature",
            options: [
              {
                value: `fish_buckets`,
                label: "Buckets",
                description: "aa",
              },
              {
                value: `fish_toolbox`,
                label: "Toolbox",
                description: "aa",
              },
              {
                value: `fish_start`,
                label: "Start",
                description: "aaa",
              },
            ],
          },
        ],
      },
    ]
  );
}
