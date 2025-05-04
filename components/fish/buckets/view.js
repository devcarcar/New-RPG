import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../utils.js";
import { sessions } from "../../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { buckets } = userData;
  let value = "";
  let opt = [];
  buckets.forEach((seafood) => {
    value += `${seafood.name} - ${seafood.weight} lbs\n`;
    opt.push({
      value: seafood.id,
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
