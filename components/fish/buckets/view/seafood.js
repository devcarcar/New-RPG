import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  CreateFollowUpMessage,
  DefaultEmbed,
  DefaultStringSelect,
  EditMessage,
  seafoodData,
} from "../../../../utils.js";
import { sessions } from "../../../../schemas/session.js";

export async function execute(interaction, data) {
  const { userData } = data;
  const { buckets } = userData;
  const found = buckets.find(
    (seafood) => seafood.id === interaction.value.split("_")[0]
  );
  return await CreateFollowUpMessage(
    interaction.token,
    [DefaultEmbed(found.name, `Weight: ${found.weight} lbs`)],
    []
  );
}
