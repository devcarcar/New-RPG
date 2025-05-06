import { MessageComponentTypes } from "discord-interactions";
import { DefaultEmbed, DefaultStringSelect, EditMessage } from "../utils.js";

export async function execute(interaction, data) {
  return await EditMessage(
    interaction.token,
    [DefaultEmbed("Pets", "Select a pets option")],
    [
      DefaultStringSelect("pets/@", "Select a pets option", [
        {
          value: "view",
          label: "View",
          description: "View your pets",
        },
        {
          value: "hatch",
          label: "Hatch",
          description: "Hatch an egg",
        },
        {
          value: "care",
          label: "Care",
          description: "Care your pets",
        },
      ]),
    ]
  );
}
