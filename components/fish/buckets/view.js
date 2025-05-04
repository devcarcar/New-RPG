import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { buckets } = userData.fish;
  let value = "";
  let opt = [];
  if (buckets.length === 0)
    return EditMessage(
      interaction.token,
      [DefaultEmbed("Fishing Buckets", "Your fishing buckets is empty")],
      [
        DefaultStringSelect("fish/@", "Select a navigation option", [
          { value: "buckets", label: "Back", description: "Go back" },
        ]),
      ]
    );
  buckets.forEach((seafood) => {
    value += `${seafood.name} - ${seafood.weight} lbs\n`;
    opt.push({
      value: `${seafood.id}_${seafood.weight}`,
      label: seafood.name,
      description: `Weight: ${seafood.weight} lbs`,
    });
  });
  return await EditMessage(
    interaction.token,
    [
      {
        title: "Fishing Buckets",
        description: "Your fishing buckets:",
        fields: [
          {
            name: "No field name",
            value: value,
            inline: true,
          },
        ],
      },
    ],
    [DefaultStringSelect("fish/buckets/view/seafood", "View a seafoood", opt)]
  );
}
